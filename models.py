from extensions import db


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    brand = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(160), nullable=False)
    tagline = db.Column(db.String(200), nullable=False)
    headline = db.Column(db.String(200), nullable=False)
    headline_accent = db.Column(db.String(80), nullable=False)
    intro = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(160), nullable=False)
    email = db.Column(db.String(160), nullable=False)
    linkedin = db.Column(db.String(240), nullable=False)
    instagram = db.Column(db.String(240), nullable=False, default="")
    whatsapp = db.Column(db.String(240), nullable=False, default="")
    figma = db.Column(db.String(240), nullable=False, default="")
    github = db.Column(db.String(240), nullable=False, default="")
    about_1 = db.Column(db.Text, nullable=False)
    about_2 = db.Column(db.Text, nullable=False)
    stamp_mark = db.Column(db.String(40), nullable=False)
    stamp_text = db.Column(db.String(160), nullable=False)
    card_lines = db.Column(db.Text, nullable=False)  # "key|value" per baris


class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    period = db.Column(db.String(60), nullable=False)
    title = db.Column(db.String(160), nullable=False)
    company = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=False)
    sort = db.Column(db.Integer, default=0)


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(60), nullable=False)
    icon = db.Column(db.String(8), nullable=False)
    title = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=False)
    tags = db.Column(db.String(200), nullable=False)  # dipisah koma
    sort = db.Column(db.Integer, default=0)


class Education(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    period = db.Column(db.String(60), nullable=False)
    school = db.Column(db.String(160), nullable=False)
    detail = db.Column(db.String(240), nullable=False)
    sort = db.Column(db.Integer, default=0)


class Award(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    year = db.Column(db.String(20), nullable=False)
    sort = db.Column(db.Integer, default=0)


class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    sort = db.Column(db.Integer, default=0)


class Certificate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    issuer = db.Column(db.String(160), nullable=False, default="")
    image = db.Column(db.String(240), nullable=False)  # path di /static
    year = db.Column(db.String(20), nullable=False, default="")
    sort = db.Column(db.Integer, default=0)


class Documentation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False, default="")
    image = db.Column(db.String(240), nullable=False)  # path di /static
    sort = db.Column(db.Integer, default=0)
