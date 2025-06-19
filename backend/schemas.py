from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from models import SplitType

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class GroupBase(BaseModel):
    name: str

class GroupCreate(GroupBase):
    user_ids: List[int]

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    user_ids: Optional[List[int]] = None

class Group(GroupBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ExpenseSplitCreate(BaseModel):
    user_id: int
    percentage: Optional[float] = None

class ExpenseBase(BaseModel):
    description: str
    amount: float
    paid_by: int
    split_type: SplitType
    splits: List[ExpenseSplitCreate]

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    paid_by: Optional[int] = None
    split_type: Optional[SplitType] = None
    splits: Optional[List[ExpenseSplitCreate]] = None

class ExpenseSplit(BaseModel):
    id: int
    user_id: int
    amount: float
    percentage: Optional[float]

    class Config:
        from_attributes = True

class Expense(ExpenseBase):
    id: int
    group_id: int
    created_at: datetime
    splits: List[ExpenseSplit] = []

    class Config:
        from_attributes = True
