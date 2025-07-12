from fpdf import FPDF
import os

def generate_report(data, filename):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.cell(200, 10, txt="HealthSync Disease Report", ln=True, align='C')
    pdf.ln(10)

    for key, value in data.items():
        pdf.cell(200, 10, txt=f"{key}: {value}", ln=True)

    path = f"reports/{filename}.pdf"
    os.makedirs("reports", exist_ok=True)
    pdf.output(path)
    return path
