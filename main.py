from parse_docx import get_result
import json

ORIGINAL = 'data/doc_origin.docx'
ORIGINAL_txt = 'data/doc_orign.txt'
JSON_modlist = 'data/doc_mod.json'
DOCUMENTS_TO_COMBINE = [
    'data/differ_paragraph/doc_mod_1.docx',
    'data/differ_paragraph/doc_mod_2.docx',
    'data/differ_paragraph/doc_mod_3.docx'
]

txt, mod_list = get_result(ORIGINAL,DOCUMENTS_TO_COMBINE)

with open(JSON_modlist, 'w') as outfile:
    json.dump(mod_list, outfile)
