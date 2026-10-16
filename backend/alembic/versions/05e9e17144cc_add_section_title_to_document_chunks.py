"""add section_title to document_chunks

Revision ID: 05e9e17144cc
Revises: 6054da45dda5
Create Date: 2026-10-16 22:28:51.070352

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "05e9e17144cc"
down_revision: Union[str, Sequence[str], None] = "6054da45dda5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "document_chunks", sa.Column("section_title", sa.Text(), nullable=True)
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("document_chunks", "section_title")
