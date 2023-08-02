import os
import re

def extract(block_data):
    class_name_reg = "\w*(?= extends)"
    sport_idx_reg = "(?<=#m_sport_idx = )(.*)(\d)"
    league_idx_reg = "(?<=#m_league_idx = )(.*)(\d)"
    name = re.search(class_name_reg, block_data).group()
    sport_idx = re.search(sport_idx_reg, block_data).group()
    league_idx = re.search(league_idx_reg, block_data).group()
    
    return f"{sport_idx}_{league_idx}", name

if __name__ == "__main__":
    f = open(os.getcwd() + '/src/engine.js')
    data = f.read()
    f.close()
    body_reg = "class \w* extends [^*]*"
    class_extr_reg = "class \w* extends [^*]*\B[}\\n]\\b"
    useful_data = re.search(body_reg, data).group()
    all_data = re.search("\w* [^*]*", data).group()[:-2]

    f = open(os.getcwd() + '/src/engine.js', "w+")
    f.writelines([all_data, "\n/**/\n"])
    f.writelines(["//    This part of file is automatically generated by api2db.py.",
                 "\n//    All changes will be deleted.\n"])
    f.write("var class_dict = {};\n")
    while re.search(class_extr_reg, useful_data) is not None:
        not_used = re.search(class_extr_reg, useful_data).group()
        cur_str = useful_data.replace(not_used, "")
        useful_data = not_used
        key, class_name = extract(cur_str)
        f.write(f"class_dict['{key}'] = new {class_name}(0);\n")
    
    key, class_name = extract(useful_data)
    f.write(f"class_dict['{key}'] = new {class_name}(0);\n")
    f.writelines(["\nfunction get_class_by_key(key)\n", "{\n    return class_dict[key];\n}"])
    f.close()