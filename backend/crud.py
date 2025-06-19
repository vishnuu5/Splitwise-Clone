from sqlalchemy.orm import Session
from sqlalchemy import and_
import models
import schemas
from typing import Dict, List

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        return None
    
    update_data = user.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        return False
    
    # Delete related records first
    db.query(models.ExpenseSplit).filter(models.ExpenseSplit.user_id == user_id).delete()
    db.query(models.Expense).filter(models.Expense.paid_by == user_id).delete()
    db.query(models.GroupMember).filter(models.GroupMember.user_id == user_id).delete()
    
    db.delete(db_user)
    db.commit()
    return True

def create_group(db: Session, group: schemas.GroupCreate):
    db_group = models.Group(name=group.name)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    
    # Add members to group
    for user_id in group.user_ids:
        db_member = models.GroupMember(group_id=db_group.id, user_id=user_id)
        db.add(db_member)
    
    db.commit()
    return db_group

def get_group(db: Session, group_id: int):
    return db.query(models.Group).filter(models.Group.id == group_id).first()

def get_groups(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Group).offset(skip).limit(limit).all()

def update_group(db: Session, group_id: int, group: schemas.GroupUpdate):
    db_group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if db_group is None:
        return None
    
    if group.name is not None:
        db_group.name = group.name
    
    if group.user_ids is not None:
        # Remove existing members
        db.query(models.GroupMember).filter(models.GroupMember.group_id == group_id).delete()
        
        # Add new members
        for user_id in group.user_ids:
            db_member = models.GroupMember(group_id=group_id, user_id=user_id)
            db.add(db_member)
    
    db.commit()
    db.refresh(db_group)
    return db_group

def delete_group(db: Session, group_id: int):
    db_group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if db_group is None:
        return False
    
    # Delete related records first
    expenses = db.query(models.Expense).filter(models.Expense.group_id == group_id).all()
    for expense in expenses:
        db.query(models.ExpenseSplit).filter(models.ExpenseSplit.expense_id == expense.id).delete()
    
    db.query(models.Expense).filter(models.Expense.group_id == group_id).delete()
    db.query(models.GroupMember).filter(models.GroupMember.group_id == group_id).delete()
    
    db.delete(db_group)
    db.commit()
    return True

def create_expense(db: Session, expense: schemas.ExpenseCreate, group_id: int):
    db_expense = models.Expense(
        description=expense.description,
        amount=expense.amount,
        group_id=group_id,
        paid_by=expense.paid_by,
        split_type=expense.split_type
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    # Create expense splits
    if expense.split_type == models.SplitType.EQUAL:
        # Get group members
        members = db.query(models.GroupMember).filter(
            models.GroupMember.group_id == group_id
        ).all()
        split_amount = expense.amount / len(members)
        
        for member in members:
            db_split = models.ExpenseSplit(
                expense_id=db_expense.id,
                user_id=member.user_id,
                amount=split_amount
            )
            db.add(db_split)
    
    elif expense.split_type == models.SplitType.PERCENTAGE:
        for split in expense.splits:
            split_amount = (expense.amount * split.percentage) / 100
            db_split = models.ExpenseSplit(
                expense_id=db_expense.id,
                user_id=split.user_id,
                amount=split_amount,
                percentage=split.percentage
            )
            db.add(db_split)
    
    db.commit()
    return db_expense

def get_expense(db: Session, expense_id: int):
    return db.query(models.Expense).filter(models.Expense.id == expense_id).first()

def get_group_expenses(db: Session, group_id: int):
    return db.query(models.Expense).filter(models.Expense.group_id == group_id).all()

def update_expense(db: Session, expense_id: int, expense: schemas.ExpenseUpdate):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if db_expense is None:
        return None
    
    # Update basic fields
    update_data = expense.dict(exclude_unset=True, exclude={'splits'})
    for field, value in update_data.items():
        setattr(db_expense, field, value)
    
    # Update splits if provided
    if expense.splits is not None:
        # Delete existing splits
        db.query(models.ExpenseSplit).filter(models.ExpenseSplit.expense_id == expense_id).delete()
        
        # Create new splits
        if expense.split_type == models.SplitType.EQUAL:
            # Get group members
            members = db.query(models.GroupMember).filter(
                models.GroupMember.group_id == db_expense.group_id
            ).all()
            split_amount = db_expense.amount / len(members)
            
            for member in members:
                db_split = models.ExpenseSplit(
                    expense_id=expense_id,
                    user_id=member.user_id,
                    amount=split_amount
                )
                db.add(db_split)
        
        elif expense.split_type == models.SplitType.PERCENTAGE:
            for split in expense.splits:
                split_amount = (db_expense.amount * split.percentage) / 100
                db_split = models.ExpenseSplit(
                    expense_id=expense_id,
                    user_id=split.user_id,
                    amount=split_amount,
                    percentage=split.percentage
                )
                db.add(db_split)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

def delete_expense(db: Session, expense_id: int):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if db_expense is None:
        return False
    
    # Delete related splits first
    db.query(models.ExpenseSplit).filter(models.ExpenseSplit.expense_id == expense_id).delete()
    
    db.delete(db_expense)
    db.commit()
    return True

def get_group_balances(db: Session, group_id: int):
    # Get all expenses for the group
    expenses = db.query(models.Expense).filter(models.Expense.group_id == group_id).all()
    
    balances = {}
    
    for expense in expenses:
        paid_by = expense.paid_by
        
        # Initialize balance for payer if not exists
        if paid_by not in balances:
            balances[paid_by] = {}
        
        for split in expense.splits:
            user_id = split.user_id
            amount = split.amount
            
            if user_id != paid_by:
                # Initialize nested dict if not exists
                if user_id not in balances:
                    balances[user_id] = {}
                if paid_by not in balances[user_id]:
                    balances[user_id][paid_by] = 0
                if user_id not in balances[paid_by]:
                    balances[paid_by][user_id] = 0
                
                # User owes money to the payer
                balances[user_id][paid_by] += amount
                balances[paid_by][user_id] -= amount
    
    # Simplify balances (net amounts)
    simplified_balances = []
    processed_pairs = set()
    
    for user1 in balances:
        for user2 in balances[user1]:
            if (user1, user2) not in processed_pairs and (user2, user1) not in processed_pairs:
                net_amount = balances[user1][user2]
                if net_amount > 0:
                    simplified_balances.append({
                        "from_user": user1,
                        "to_user": user2,
                        "amount": net_amount
                    })
                elif net_amount < 0:
                    simplified_balances.append({
                        "from_user": user2,
                        "to_user": user1,
                        "amount": abs(net_amount)
                    })
                processed_pairs.add((user1, user2))
                processed_pairs.add((user2, user1))
    
    return simplified_balances

def get_user_balances(db: Session, user_id: int):
    # Get all groups the user is part of
    group_memberships = db.query(models.GroupMember).filter(
        models.GroupMember.user_id == user_id
    ).all()
    
    user_balances = []
    
    for membership in group_memberships:
        group_balances = get_group_balances(db, membership.group_id)
        group = get_group(db, membership.group_id)
        
        # Filter balances involving this user
        relevant_balances = [
            balance for balance in group_balances 
            if balance["from_user"] == user_id or balance["to_user"] == user_id
        ]
        
        if relevant_balances:
            user_balances.append({
                "group_id": group.id,
                "group_name": group.name,
                "balances": relevant_balances
            })
    
    return user_balances
