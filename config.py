import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # Ganti ke PostgreSQL 15 nanti cukup dengan mengubah DATABASE_URL, contoh:
    #   postgresql+psycopg2://postgres:password@localhost:5432/portfolio
    if os.environ.get("VERCEL"):
        # Filesystem Vercel read-only kecuali /tmp
        SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:////tmp/portfolio.db")
    else:
        SQLALCHEMY_DATABASE_URI = os.environ.get(
            "DATABASE_URL", "sqlite:///" + os.path.join(basedir, "portfolio.db")
        )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
