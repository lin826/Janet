
1. Download orginal docx file and modified docx file(s) from Google Doc

2. Run main.py to get needed json and txt file.
  The txt would be the original file's name embedded with '.txt' at the end.
  The json would be the name you specify in the second argument.
      python3 main.py [ORIGINAL] [JSON] [MODIFIED FILES...]

  The command for example:
      python3 main.py data/doc_origin.docx data/doc_mod.json data/differ_paragraph/doc_mod_1.docx data/differ_paragraph/doc_mod_2.docx data/differ_paragraph/doc_mod_3.docx

3. Open index.html with 'str', 'txt', 'json' arguments in url.
  What integer 'str' indicates to would be the start stage. If it's not between 0 to 2, the page would show all comments from different stages.
  'txt' is the file location of original txt generated from step 2.
  'json' is the file location of modified history json file generated from step 2.

  URL for example:
      https://janets-lin000.c9users.io/index.html?str=0&txt=data/doc_origin.docx.txt&json=data/doc_mod.json
