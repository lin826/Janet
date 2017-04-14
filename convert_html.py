INPUT_TXT = 'data/doc_origin.docx.txt'
OUTPUT_HTML = 'test.html'


str_rating = "<div class='ui huge star rating'></div>"
str_solved = "<button class='ui primary button'>Solved</button>"

full_page = ""

def write_content():
    global full_page
    with open(INPUT_TXT,'r') as file:
        c = file.readline()
        while(c=='\n'):
            c = file.readline()
        full_page += "<h2 id='title' align='center'>"+c+"</h2>\n"
        full_page += "<div class='half mCustomScrollbar' data-mcs-theme='inset-2-dark'>\n\t<p id='content'>"
        while(c):
            c = file.readline()
            c.replace('\n','<br>')
            full_page += c+'<br>'
        full_page += "</p>\n</div>"

    full_page += "</div>\n\t</td>\n\t<td>\n\t<div id='history'>"
    return 0


with open('data/index_prefix.html','r') as file:
    c = file.read()
    full_page += c

write_content()

with open('data/index_postfix.html','r') as file:
    c = file.read()
    full_page += c

with open(OUTPUT_HTML,'w') as file:
    file.write(full_page)
