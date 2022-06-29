from bs4 import BeautifulSoup

if __name__ == '__main__':
    with open('utils/sports.ui') as fp:
        soup = BeautifulSoup(fp, 'xml')

    # 42 version doesn't support position for stack widget
    for pos in soup.select('property[name="position"]'):
        pos.extract()

    # Array[i], 0 - tag, 1, 2 - attrs
    tags = [
        ['object', 'GtkListStore', 'list_sports'], 
        ['object', 'GtkViewport', 'view_main'], 
        # ['object', 'GtkAdjustment', 'spin_vals_delta'], 
        # ['object', 'GtkViewport', 'view_base_settings']
    ]

    # Template ui
    with open('utils/template.ui') as fp:
        template_soup = BeautifulSoup(fp, 'xml')
    # Tag for insert
    after_tag = template_soup.find('object', {'class': 'AdwPreferencesGroup', 
    'id' : 'settings_group'})
    after_tag = after_tag.find('child')
    
    # Add all elements of base glade ui
    for el in tags:
        small_soup = soup.find(el[0], {'class': el[1], 'id': el[2]})
        after_tag.append(small_soup)

    # Save new one
    with open('src/gtk4.ui', 'w') as file:
        file.write(str(template_soup))

