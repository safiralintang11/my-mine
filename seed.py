from extensions import db
from models import Profile, Experience, Project, Education, Award, Skill

CARD_LINES = "\n".join([
    "whoami|Safira Lintang Zhahrani",
    "focus --areas|web.dev · it.support · infrastructure",
    "status --services|all systems operational",
])

INSTAGRAM = "https://www.instagram.com/its.lintang?stkn=MTYwbWUwN214OTB6bw=="
WHATSAPP = "https://wa.me/qr/3TVQE4A77IMBF1"
FIGMA = "https://www.figma.com/design/KzcZjz0x5f05nbhGgLtnip/My-Porto?node-id=2303-302&t=xsZGPVf3R804tzNV-1"


def run_seed():
    db.session.add(Profile(
        name="Safira Lintang Zhahrani",
        brand="SAFIRA LINTANG",
        role="IT support & web service engineer",
        tagline="IT support & web service engineer",
        headline="Membuat sistem bekerja",
        headline_accent="lebih baik.",
        intro="Saya Safira, praktisi IT yang menghubungkan pengembangan web, infrastruktur, dan dukungan teknis agar teknologi terasa sederhana dan bisa diandalkan.",
        location="Berbasis di Sidoarjo, Jawa Timur · Indonesia",
        email="safiralintang72@gmail.com",
        linkedin="https://bit.ly/Safiralintanglinkedin",
        instagram=INSTAGRAM,
        whatsapp=WHATSAPP,
        figma=FIGMA,
        about_1="Lulusan <strong>SMK Telkom Sidoarjo</strong> dengan pengalaman di pengembangan aplikasi web, administrasi sistem, pengelolaan database, dan dukungan pengguna.",
        about_2="Terbiasa mengembangkan aplikasi menggunakan Laravel dan Flask, mengelola layanan server, serta membantu pengguna menyelesaikan kendala teknis. Saya nyaman bekerja mandiri maupun dalam tim, dan antusias mempelajari hal baru.",
        stamp_mark="IT<br>≋ web",
        stamp_text="Belajar cepat. Bekerja kolaboratif. Selalu mencari cara yang lebih baik.",
        card_lines=CARD_LINES,
    ))

    experiences = [
        ("2026 — Sekarang", "IT Staff", "PT Ladang Sehat Indonesia",
         "Mengembangkan dan memelihara aplikasi digitalisasi berbasis Laravel; mengelola database, infrastruktur TI, jaringan, layanan email, inventaris aset, dan dukungan teknis pengguna."),
        ("2025 — 2026", "Internship IT", "PT Ladang Sehat Indonesia",
         "Menangani jaringan dan perangkat kerja, administrasi Zimbra dan Roundcube, dukungan teknis harian, serta pengujian aplikasi internal perusahaan."),
        ("2024 — 2025", "Associate IT Infrastructure & Web Service Development", "PT Integra Teknologi Solusi",
         "Mengembangkan aplikasi web dan REST API; mengelola WordPress, Apache, SSL/TLS, backup PostgreSQL dengan Barman, serta monitoring layanan menggunakan Uptime Kuma."),
        ("2025 — Sekarang", "Guru Les Privat", "Mandiri",
         "Mengajar siswa SD dan SMP dengan metode belajar yang disesuaikan, materi tambahan, dan latihan soal untuk membantu meningkatkan pemahaman serta kepercayaan diri."),
    ]
    for i, (period, title, company, desc) in enumerate(experiences, 1):
        db.session.add(Experience(period=period, title=title, company=company, description=desc, sort=i))

    projects = [
        ("01 — Application", "↗", "Digitalisasi proses bisnis",
         "Aplikasi internal berbasis Laravel untuk membantu alur administrasi lebih efisien, akurat, dan mudah dikelola.",
         "Laravel,PHP,Database"),
        ("02 — Web services", "⌘", "Web service & REST API",
         "Pengembangan aplikasi web dan API terintegrasi database untuk mendukung kebutuhan operasional serta otomatisasi data.",
         "Python,Flask,PostgreSQL"),
        ("03 — Infrastructure", "⌁", "Infrastruktur yang andal",
         "Pengelolaan server web, sistem backup, monitoring layanan, dan konfigurasi keamanan untuk menjaga layanan tetap tersedia.",
         "Linux,Apache,Uptime Kuma"),
    ]
    for i, (label, icon, title, desc, tags) in enumerate(projects, 1):
        db.session.add(Project(label=label, icon=icon, title=title, description=desc, tags=tags, sort=i))

    education = [
        ("2026 — kini", "Universitas Terbuka", "Sistem Informasi"),
        ("2022 — 2025", "SMK Telkom Sidoarjo", "Teknik Jaringan Akses Telekomunikasi · Nilai akhir 88,13 / 100"),
    ]
    for i, (period, school, detail) in enumerate(education, 1):
        db.session.add(Education(period=period, school=school, detail=detail, sort=i))

    awards = [
        ("English Speech Competition · Juara 1", "2023"),
        ("UI/UX Design Competition · Finalis", "2023"),
        ("Poster Design Competition · Juara 2", "2024"),
        ("TOEIC Certified · Skor 327", "Bahasa"),
    ]
    for i, (name, year) in enumerate(awards, 1):
        db.session.add(Award(name=name, year=year, sort=i))

    skills = ["Laravel · PHP", "Python · Flask", "PostgreSQL · MySQL", "Linux · Apache", "IT Support", "Networking"]
    for i, name in enumerate(skills, 1):
        db.session.add(Skill(name=name, sort=i))

    db.session.commit()
