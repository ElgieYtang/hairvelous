# Capstone Test Table Mapping

## Unit Tests

| Test ID | Module | Description | Status |
|---------|--------|-------------|--------|
| UA-001 | Auth | Login returns token for valid user | ✅ IMPLEMENTED |
| UA-002 | Auth | Login rejects invalid email | TODO |
| UA-003 | Auth | Login rejects invalid password | TODO |
| UA-004 | Auth | Register creates user with hashed password | TODO |
| UA-005 | Auth | Register rejects duplicate email | TODO |
| UA-006 | Auth | Forgot password generates reset token | TODO |
| UA-007 | Auth | Reset password validates token expiration | TODO |
| UA-008 | Auth | Reset password updates password hash | TODO |
| UA-009 | Auth | JWT token contains correct user ID | TODO |
| UA-010 | Auth | Password hashing uses bcrypt with salt rounds 10 | TODO |
| AC-001 | Assessment | Create assessment returns assessment ID | TODO |
| AC-002 | Assessment | Save responses stores question-answer pairs | TODO |
| AC-003 | Assessment | Get results parses responses correctly | TODO |
| AC-004 | Assessment | Get results creates hair profile | TODO |
| AC-005 | Assessment | Get results updates existing profile | TODO |
| AC-006 | Assessment | Get results extracts hair type from responses | TODO |
| AC-007 | Assessment | Get results extracts scalp condition from responses | TODO |
| AC-008 | Assessment | Get results extracts issues array from responses | TODO |
| AC-009 | Assessment | Get latest results returns most recent assessment | TODO |
| AC-010 | Assessment | Get results verifies user ownership | TODO |
| AC-011 | Assessment | Assessment session belongs to correct user | TODO |
| AC-012 | Assessment | Multiple responses for same question overwrites previous | TODO |
| AC-013 | Assessment | Empty responses array clears existing responses | TODO |
| AC-014 | Assessment | Get results handles missing profile gracefully | TODO |
| AC-015 | Assessment | Date taken is set on assessment creation | TODO |
| PR-001 | Recommendation | Generate recommendations maps issues to categories | TODO |
| PR-002 | Recommendation | Generate recommendations scores products correctly | TODO |
| PR-003 | Recommendation | Generate recommendations filters by budget | TODO |
| PR-004 | Recommendation | Generate recommendations filters by product type | TODO |
| PR-005 | Recommendation | Generate recommendations returns 5-10 products | TODO |
| PR-006 | Recommendation | Generate recommendations creates routine plan | TODO |
| PR-007 | Recommendation | Generate recommendations includes warnings | TODO |
| PR-008 | Recommendation | Generate recommendations matches DIY guides | TODO |
| PR-009 | Recommendation | Thinning issue returns no products, only advice | TODO |
| PR-010 | Recommendation | Hair type compatibility affects scoring | TODO |
| PR-011 | Recommendation | Scalp condition compatibility affects scoring | TODO |
| PR-012 | Recommendation | Generate reason text includes all relevant factors | TODO |
| DG-001 | Guides | List guides returns published guides only | TODO |
| DG-002 | Guides | List guides filters by category | TODO |
| DG-003 | Guides | List guides filters by difficulty | TODO |
| DG-004 | Guides | Get guide returns full guide details | TODO |
| DG-005 | Guides | Create guide validates category enum | TODO |
| DG-006 | Guides | Create guide validates difficulty enum | TODO |
| DG-007 | Guides | Create guide sets created_by to admin user ID | TODO |
| DG-008 | Guides | Update guide allows partial updates | TODO |
| DG-009 | Guides | Delete guide removes guide from database | TODO |
| DG-010 | Guides | Get guide includes creator name via JOIN | TODO |
| RT-001 | Routine | Create log stores routine entry | TODO |
| RT-002 | Routine | Get user logs returns logs for specific user only | TODO |
| RT-003 | Routine | Get user logs respects limit parameter | TODO |
| RT-004 | Routine | Get progress summary groups by week | TODO |
| RT-005 | Routine | Get progress summary respects weeks parameter | TODO |
| RT-006 | Routine | Update log verifies user ownership | TODO |
| RT-007 | Routine | Delete log verifies user ownership | TODO |
| RT-008 | Routine | Date logged is stored as DATE type | TODO |
| RT-009 | Routine | Notes field is optional | TODO |
| RT-010 | Routine | Activity type is required | TODO |
| PM-001 | Photos | Upload photo creates database record | TODO |
| PM-002 | Photos | Upload photo stores relative path | TODO |
| PM-003 | Photos | Get user photos returns only user's photos | TODO |
| PM-004 | Photos | Replace photo deletes old file | TODO |
| PM-005 | Photos | Replace photo verifies user ownership | TODO |
| PM-006 | Photos | Delete photo removes file from filesystem | TODO |
| PM-007 | Photos | Delete photo verifies user ownership | TODO |
| PM-008 | Photos | AI result field is optional | TODO |
| UM-001 | Admin/Users | List users returns all users with role names | TODO |
| UM-002 | Admin/Users | Suspend user sets is_suspended flag | TODO |
| UM-003 | Admin/Users | Reactivate user clears is_suspended flag | TODO |
| UM-004 | Admin/Users | Reset user password updates password hash | TODO |
| UM-005 | Admin/Users | List users includes assessment count | TODO |
| UM-006 | Admin/Users | Admin cannot suspend themselves | TODO |
| UM-007 | Admin/Users | User list is ordered by date_created DESC | TODO |
| UM-008 | Admin/Users | Reports return correct user count | TODO |
| PM-001 | Admin/Products | Create product requires name and price | TODO |
| PM-002 | Admin/Products | Create product allows multiple categories | TODO |
| PM-003 | Admin/Products | Update product allows partial updates | TODO |
| PM-004 | Admin/Products | Delete product soft deletes (sets is_active = 0) | TODO |
| PM-005 | Admin/Products | List products filters by category | TODO |
| PM-006 | Admin/Products | Get product includes categories via JOIN | TODO |
| PM-007 | Admin/Products | Product slug must be unique | TODO |
| PM-008 | Admin/Products | Price must be positive decimal | TODO |
| GM-001 | Admin/Guides | Create guide requires title and steps | TODO |
| GM-002 | Admin/Guides | Create guide validates category enum | TODO |
| GM-003 | Admin/Guides | Create guide validates difficulty enum | TODO |
| GM-004 | Admin/Guides | Update guide allows partial updates | TODO |
| GM-005 | Admin/Guides | Delete guide removes from database | TODO |
| GM-006 | Admin/Guides | Create guide sets created_by to admin ID | TODO |
| GM-007 | Admin/Guides | Ingredients field is optional | TODO |
| GM-008 | Admin/Guides | Caution field is optional | TODO |

## Integration Tests

| Test ID | Description | Status |
|---------|-------------|--------|
| IT-01 | Creating assessment triggers recommendation generation | ✅ IMPLEMENTED |
| IT-02 | User registration → login → assessment → recommendations flow | TODO |
| IT-03 | Admin creates product → appears in recommendations | TODO |
| IT-04 | Photo upload → stored in database → retrievable | TODO |
| IT-05 | Routine log → progress summary calculation | TODO |
| IT-06 | Admin creates guide → visible in public list | TODO |
| IT-07 | Forgot password → reset token → password update | TODO |
| IT-08 | Admin suspends user → user cannot login | TODO |
| IT-09 | Assessment with thinning issue → no products, advice only | TODO |

## Test Coverage Summary

- **Total Unit Tests**: 95 (2 implemented, 93 TODO)
- **Total Integration Tests**: 9 (1 implemented, 8 TODO)
- **Framework**: Jest + Supertest
- **Coverage Target**: 80%+
