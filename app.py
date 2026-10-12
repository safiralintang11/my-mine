from flask import Flask, render_template
from config import Config
from extensions import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    from models import Profile, Experience, Project, Education, Award, Skill, Certificate, Documentation

    def _ensure_profile_columns():
        # SQLite tidak mendukung migrasi otomatis: tambahkan kolom baru bila belum ada.
        with db.engine.connect() as conn:
            cols = {row[1] for row in conn.execute(db.text("PRAGMA table_info(profile)"))}
            for name in ("instagram", "whatsapp", "figma", "github"):
                if name not in cols:
                    conn.execute(db.text(f"ALTER TABLE profile ADD COLUMN {name} VARCHAR(240) NOT NULL DEFAULT ''"))
            conn.commit()

    def _backfill_profile_links():
        from seed import INSTAGRAM, WHATSAPP, FIGMA
        profile = Profile.query.first()
        if profile and (not profile.instagram or not profile.whatsapp or not profile.figma):
            profile.instagram = profile.instagram or INSTAGRAM
            profile.whatsapp = profile.whatsapp or WHATSAPP
            profile.figma = profile.figma or FIGMA
            db.session.commit()

    with app.app_context():
        db.create_all()
        _ensure_profile_columns()
        if not Profile.query.first():
            from seed import run_seed
            run_seed()
        _backfill_profile_links()

    @app.route("/")
    def index():
        profile = Profile.query.first()
        experiences = Experience.query.order_by(Experience.sort).all()
        projects = Project.query.order_by(Project.sort).all()
        education = Education.query.order_by(Education.sort).all()
        awards = Award.query.order_by(Award.sort).all()
        skills = Skill.query.order_by(Skill.sort).all()
        return render_template("index.html", **locals())

    @app.route("/portofolio")
    def portofolio():
        profile = Profile.query.first()
        projects = Project.query.order_by(Project.sort).all()
        certificates = Certificate.query.order_by(Certificate.sort).all()
        documentations = Documentation.query.order_by(Documentation.sort).all()
        return render_template("portfolio.html", **locals())

    return app


if __name__ == "__main__":
    create_app().run(debug=True)
