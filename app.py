from flask import Flask, render_template
from sqlalchemy import inspect, text
from config import Config
from extensions import db

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

from models import Profile, Experience, Project, Education, Award, Skill, Certificate, Documentation


def _ensure_columns(table, columns):
    # db.create_all() tidak menambah kolom pada tabel lama, jadi lengkapi manual.
    inspector = inspect(db.engine)
    if table not in inspector.get_table_names():
        return
    existing = {column["name"] for column in inspector.get_columns(table)}
    with db.engine.begin() as conn:
        for name, ddl in columns:
            if name not in existing:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))


def _ensure_profile_columns():
    _ensure_columns("profile", [
        (name, "VARCHAR(240) NOT NULL DEFAULT ''")
        for name in ("instagram", "whatsapp", "figma", "github")
    ])


def _ensure_project_columns():
    _ensure_columns("project", [
        ("url", "VARCHAR(240) NOT NULL DEFAULT ''"),
        ("image", "VARCHAR(240) NOT NULL DEFAULT ''"),
        ("theme", "VARCHAR(20) NOT NULL DEFAULT 'blush'"),
        ("year", "VARCHAR(20) NOT NULL DEFAULT ''"),
    ])


def _backfill_profile_links():
    from seed import INSTAGRAM, WHATSAPP, FIGMA
    profile = Profile.query.first()
    if profile and (not profile.instagram or not profile.whatsapp or not profile.figma):
        profile.instagram = profile.instagram or INSTAGRAM
        profile.whatsapp = profile.whatsapp or WHATSAPP
        profile.figma = profile.figma or FIGMA
        db.session.commit()


def init_db():
    with app.app_context():
        db.create_all()
        _ensure_profile_columns()
        _ensure_project_columns()
        if not Profile.query.first():
            from seed import run_seed
            run_seed()
        from seed import seed_featured_projects
        seed_featured_projects()
        _backfill_profile_links()


init_db()


@app.route("/")
def index():
    profile = Profile.query.first()
    experiences = Experience.query.order_by(Experience.sort).all()
    projects = Project.query.order_by(Project.sort).all()
    education = Education.query.order_by(Education.sort).all()
    awards = Award.query.order_by(Award.sort).all()
    skills = Skill.query.order_by(Skill.sort).all()
    featured = [p for p in projects if p.url]
    focus = [p for p in projects if not p.url]
    return render_template("index.html", **locals())


@app.route("/portofolio")
def portofolio():
    profile = Profile.query.first()
    projects = Project.query.order_by(Project.sort).all()
    certificates = Certificate.query.order_by(Certificate.sort).all()
    documentations = Documentation.query.order_by(Documentation.sort).all()
    featured = [p for p in projects if p.url]
    focus = [p for p in projects if not p.url]
    return render_template("portfolio.html", **locals())


if __name__ == "__main__":
    app.run(debug=True)
