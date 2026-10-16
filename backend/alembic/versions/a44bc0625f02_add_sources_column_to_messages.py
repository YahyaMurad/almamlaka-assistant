"""add sources column to messages

Revision ID: a44bc0625f02
Revises: e8f0c6ead515
Create Date: 2026-10-16 19:21:59.349775

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a44bc0625f02"
down_revision: Union[str, Sequence[str], None] = "e8f0c6ead515"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("messages", sa.Column("sources", postgresql.JSONB(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("messages", "sources")
