"""add client_id to conversations

Revision ID: 6054da45dda5
Revises: 69001cf0b081
Create Date: 2026-10-16 22:05:23.902495

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "6054da45dda5"
down_revision: Union[str, Sequence[str], None] = "69001cf0b081"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("conversations", sa.Column("client_id", sa.Text(), nullable=True))
    op.create_index("ix_conversations_client_id", "conversations", ["client_id"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_conversations_client_id", table_name="conversations")
    op.drop_column("conversations", "client_id")
