import zipfile
from bs4 import BeautifulSoup

# class mod_element:
#     {'modifier':'mod_'+str(i),'index_start':0,'index_end':0,'mod_type':'','mod_history':'','mod_comment':''}

def transfer_ori_txt():
    with zipfile.ZipFile(ORIGINAL, 'r') as zfp:
        with zfp.open('word/document.xml') as fp:
            soup_ori = BeautifulSoup(fp.read(), 'xml')
    context_ori = ""
    for a in soup_ori.body.find_all("p"): # Each paragraph
        for b in a.find_all("r"):
            for c in b.find_all("t"):
                context_ori += c.string
        context_ori += "\n"

    with open(ORIGINAL_txt, 'w') as f:
        f.write(context_ori)

def get_ori_txt():
    with open(ORIGINAL_txt,'r') as f:
        r = f.read();
    return r

def set_mod_docx():
    for filename in DOCUMENTS_TO_COMBINE:
        with zipfile.ZipFile(filename, 'r') as zfp:
            with zfp.open('word/document.xml') as fp:
                soup_mod.append(BeautifulSoup(fp.read(), 'xml'))
            with zfp.open('word/comments.xml') as fp:
                soup_mod_comment.append(BeautifulSoup(fp.read(), 'xml'))
def set_mod():
    for i in range(len(soup_mod)):
        set_mod_list(i)
        result_list.sort(key=lambda x: (x['index_start'],x['index_end']), reverse=False)

def set_mod_list(i):
    index = 0
    current_element = {'modifier':'mod_'+str(i),'index_start':index+1,'index_end':index+1,'mod_type':'','mod_history':'','mod_comment':''}
    comment_element = {'modifier':'mod_'+str(i),'index_start':index+1,'index_end':index+1,'mod_type':'','mod_history':'','mod_comment':''}
    e_id = -1
    c_id = -1
    for p in soup_mod[i].body:
        for e in p:
            if(e.name == "ins"):
                if(e_id != e['w:id'] and current_element['index_end']!=index): # New element
                    e_id = e['w:id']
                    if(current_element):
                        result_list.append(current_element)
                    current_element = {'modifier':'mod_'+str(i),'index_start':index+1,'index_end':index+1,'mod_type':'','mod_history':'"'+e.find("t").string+'"','mod_comment':''}
                    current_element['mod_type'] = ("Insert")
                else:
                    if(current_element['mod_type']!="Comment"):
                        current_element['mod_type'] = ("Replace")
                        pre = current_element['mod_history']
                        current_element['mod_history'] = (pre+' with "'+e.find("t").string+'"')
                    else:
                        current_element['mod_type'] = ("Insert")
                        current_element['mod_history'] = '"'+e.find("t").string+'"'
                c = e.find("commentRangeStart")
                if(c):
                    for a in soup_mod_comment[i].find(attrs={"w:id":str(c["w:id"])}).find_all('t'):
                        current_element['mod_comment'] += (a.string+"\n")
            elif(e.name== "del"):
                if(e_id != e['w:id']): # New element
                    e_id = e['w:id']
                    if(current_element):
                        result_list.append(current_element)
                    current_element = {'modifier':'mod_'+str(i),'index_start':index+1,'index_end':index+1,'mod_type':'','mod_history':'"'+e.find("delText").string+'"','mod_comment':''}
                    current_element['mod_type'] = "Delete"
                else:
                    if(current_element['mod_type']!="Comment"):
                        current_element['mod_type'] = "Replace"
                        post = current_element['mod_history']
                        current_element['mod_history'] = ('"'+e.find("delText").string+'" with '+post)
                    else:
                        current_element['mod_type'] = ("Delete")
                        current_element['mod_history'] = (e.find("t").string)
                c = e.find("commentRangeStart")
                if(c):
                    for a in soup_mod_comment[i].find(attrs={"w:id":str(c["w:id"])}).find_all('t'):
                        current_element['mod_comment'] += (a.string+"\n")
                index += len(e.find("delText").string)
                current_element['index_end'] = index
            elif(e.name== "commentRangeStart"):
                c_id = e['w:id']
                if(current_element):
                    if(current_element['index_end']!=index):
                        comment_element = {'modifier':'mod_'+str(i),'index_start':index+1,'index_end':index+1,'mod_type':'','mod_history':'','mod_comment':''}
                        comment_element['mod_type'] = ("Comment")
                        for a in soup_mod_comment[i].find(attrs={"w:id":str(e["w:id"])}).find_all('t'):
                            comment_element['mod_comment'] += (a.string+"\n\n")
                    else:
                        comment_element = None
                        for a in soup_mod_comment[i].find(attrs={"w:id":str(e["w:id"])}).find_all('t'):
                            current_element['mod_comment'] += (a.string+"\n\n")
                        if(current_element['mod_type']==""):
                            current_element['mod_type'] = ("Comment")
            elif(e.name== "commentRangeEnd"):
                if(e['w:id']==c_id):
                    if(comment_element):
                        comment_element['index_end'] = index
                        result_list.append(comment_element)
                    else:
                        current_element['index_end'] = index
            else:
                for a in e.find_all("t"):
                    s = a.string
                    index += len(s)

def print_result():
    for m in result_list:
        print(m['index_start'],m['index_end'],m['mod_type'], m['mod_history'])
        print("         ",m['mod_comment'])

def main_part():
    transfer_ori_txt()
    global ori
    ori = get_ori_txt()
    global soup_mod
    soup_mod = list()
    global soup_mod_comment
    soup_mod_comment = list()
    global result_list
    result_list = list()

    set_mod_docx()
    set_mod()
    # print_result()


# For others to call
def get_result(ori_f,mod_lf):
    global ORIGINAL
    ORIGINAL = ori_f
    global ORIGINAL_txt
    ORIGINAL_txt = ori_f+'.txt'
    global DOCUMENTS_TO_COMBINE
    DOCUMENTS_TO_COMBINE = mod_lf
    main_part()
    return ori, result_list
