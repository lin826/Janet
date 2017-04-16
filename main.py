from parse_docx import get_result
import json
import sys

ORIGINAL = 'data/doc_origin.docx'
JSON_modlist = 'data/doc_mod.json'
DOCUMENTS_TO_COMBINE = []

if __name__ == '__main__':
    ORIGINAL = sys.argv[1]
    JSON_modlist = sys.argv[2]
    for arg in sys.argv[3:]:
        DOCUMENTS_TO_COMBINE.append(arg)

    txt, mod_list = get_result(ORIGINAL,DOCUMENTS_TO_COMBINE)
    with open(JSON_modlist, 'w') as outfile:
        json.dump(mod_list, outfile)
