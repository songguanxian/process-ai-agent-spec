from pathlib import Path
import os

from docx import Document


DOCX = Path(os.environ["OUTPUT_DOCX"])


def is_empty_tail_paragraph(paragraph):
    if paragraph.text.strip():
        return False
    el = paragraph._element
    if el.xpath(".//w:drawing"):
        return False
    if el.xpath(".//w:pict"):
        return False
    if el.xpath(".//w:br[@w:type='page']"):
        return False
    if el.xpath(".//w:sectPr"):
        return False
    return True


doc = Document(str(DOCX))
removed = 0
for paragraph in reversed(doc.paragraphs):
    if not is_empty_tail_paragraph(paragraph):
        break
    paragraph._element.getparent().remove(paragraph._element)
    removed += 1

doc.save(str(DOCX))
print(f"removed={removed}")
