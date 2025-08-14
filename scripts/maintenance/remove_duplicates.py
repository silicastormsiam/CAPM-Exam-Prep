# File Name: remove_duplicates.py
# Owner: Andrew
# Purpose: Removes duplicate questions from questions.json, retaining lowest ID, with detailed report
# Version Control: v1.3
# Change Log:
#   Created: 05-Aug-2025
#   Updated: 05-Aug-2025, v1.3: Fixed TypeError in min function, improved report

import json
from collections import defaultdict

# Expected removed IDs
expected_removed_ids = [116, 177, 165, 248, 305, 306, 307]

with open('M:\\OneDrive\\Documents\\GitHub\\excel_to_json\\data\\questions.json', 'r') as f:
    questions = json.load(f)

# Count before
total_before = len(questions)
print(f'Total questions before removal: {total_before}')

# Identify duplicates
dup_dict = defaultdict(list)
for q in questions:
    text = q['question']
    if text:
        normalized = text.strip().lower()
        dup_dict[normalized].append(q)

# Report duplicates
duplicate_groups = {k: [q['id'] for q in v] for k, v in dup_dict.items() if len(v) > 1}
if duplicate_groups:
    print('Identified duplicate questions to be removed (retaining lowest ID):')
    for text, ids in duplicate_groups.items():
        keep_id = min(ids)
        remove_ids = [id for id in ids if id != keep_id]
        print(f'  "{text}" with IDs: {ids} (retain {keep_id}, remove {remove_ids})')
else:
    print('No duplicates found')
    exit()

# Remove duplicates
unique_questions = []
removed_ids = []
for group in dup_dict.values():
    keep = min(group, key=lambda x: x['id'])
    removed = [q['id'] for q in group if q['id'] != keep['id']]
    removed_ids.extend(removed)
    unique_questions.append(keep)

unique_questions.sort(key=lambda x: x['id'])

# Count after
total_after = len(unique_questions)
print(f'Total questions after removal: {total_after}')

# Verify removed IDs
removed_ids.sort()
if set(removed_ids) == set(expected_removed_ids):
    print(f'Success: Removed {len(removed_ids)} duplicates with IDs: {removed_ids}')
    with open('M:\\OneDrive\\Documents\\GitHub\\excel_to_json\\data\\questions_updated.json', 'w') as f:
        json.dump(unique_questions, f, indent=4)
    print('Duplicates successfully removed and saved as questions_updated.json')
else:
    print('Verification failed: Removed IDs do not match expected')
    print(f'Expected: {expected_removed_ids}')
    print(f'Actual: {removed_ids}')
