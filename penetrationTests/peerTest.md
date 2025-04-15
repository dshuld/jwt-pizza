# Peer Test 05/11/2025
## Kate Hill and Dylan Shuldberg

## Self Attack
### Kate:
| Item | Result|
| --- | --- |
| Date | April 10, 2025 |
| Target | pizza.rundiary.click |
| Classification | Security Misconfiguartion |
| Severity | 2 |
| Description | Default admin login still in use. Gained admin access. |
| Image | ![attack 1](attack1.png) |
| Corrections | Remove default users, add new admin with secure login. |

| Item | Result|
| --- | --- |
| Date | April 10, 2025 |
| Target | pizza.rundiary.click |
| Classification | Injection |
| Severity | 1 |
| Description | SQL injection changed all users to have new username and password. Gained admin access and all accounts are unusable. |
| Image | ![attack 2](attack2.png) |
| Corrections | Parameterize SQL statement to update user. |

### Dylan:

| Item | Result|
| --- | --- |
| Date | April 10, 2025 |
| Target | pizza.shuldberg.click |
| Classification | Broken Access Control |
| Severity | 2 |
| Description | Admin accounts can be inserted without authentication. |
| Image | ![attack 5](attack5.png) ![attack 6](attack6.png) |
| Corrections | Remove functionality that was added to registration to allow other roles. |

| Item | Result|
| --- | --- |
| Date | April 10, 2025 |
| Target | pizza.shuldberg.click |
| Classification | Security Misconfiguration |
| Severity | 2 |
| Description | Admin account uses default password. |
| Image | ![attack 7](attack7.png) |
| Corrections | Changed default password and reset database. |

| Item | Result|
| --- | --- |
| Date | April 10, 2025 |
| Target | pizza.shuldberg.click |
| Classification | Injection |
| Severity | 3 |
| Description | Update user endpoint does not sanitize email field for SQL.  |
| Image | ![attack 8](attack8.png) ![attack 9](attack9.png) ![attack 10](attack10.png) |
| Corrections | Used a prepared statement instead of concatenation. |

| Item | Result|
| --- | --- |
| Date | April 10, 2025 |
| Target | pizza.shuldberg.click |
| Classification | Security Misconfiguration |
| Severity | 4 |
| Description | Stack trace exposed to user. |
| Image | ![attack 9](attack9.png) |
| Corrections | Removed stack trace from output. |

| Item | Result|
| --- | --- |
| Date | April 10, 2025 |
| Target | pizza.shuldberg.click |
| Classification | Security Misconfiguration |
| Severity | 4 |
| Description | Docs page exposed to user. |
| Image | ![attack 11](attack11.png) |
| Corrections | Removed docs page. |

| Item | Result|
| --- | --- |
| Date | April 10, 2025 |
| Target | pizza.shuldberg.click |
| Classification | Broken Access Control |
| Severity | 3 |
| Description | Free pizzas acquired by modifying the HTTP request. |
| Image | ![attack 12](attack12.png) ![attack 13](attack13.png) |
| Corrections | Attempted to rely on price in database instead of from client. |

## Peer Attack
### Kate attack on Dylan:
| Item | Result|
| --- | --- |
| Date | April 11, 2025 |
| Target | pizza.shuldberg.click |
| Classification | Security Misconfiguartion |
| Severity | None |
| Description | Attempted default admin login, not recognized. |
| Image | ![attack 3](attack3.png) |
| Corrections | None |

| Item | Result|
| --- | --- |
| Date | April 11, 2025 |
| Target | pizza.shuldberg.click |
| Classification | Injection |
| Severity | None |
| Description | SQL injection attempted but safeguarded against. |
| Image | ![attack 4](attack4.png) |
| Corrections | None |

### Dylan attack on Kate:

| Item | Result|
| --- | --- |
| Date | April 11, 2025 |
| Target | pizza.rundiary.click |
| Classification | Security Misconfiguration |
| Severity | None |
| Description | Attempted default admin login. No effect. |
| Image | ![attack 14](attack14.png) |
| Corrections | None |

| Item | Result|
| --- | --- |
| Date | April 11, 2025 |
| Target | pizza.rundiary.click |
| Classification | Broken Access Control |
| Severity | None |
| Description | Attempted inserting admin. No effect. |
| Image | ![attack 15](attack15.png) |
| Corrections | None |

| Item | Result|
| --- | --- |
| Date | April 11, 2025 |
| Target | pizza.rundiary.click |
| Classification | Security Misconfiguration |
| Severity | 4 |
| Description | Gained access to the docs page |
| Image | ![attack 16](attack16.png) |
| Corrections | Consider removing public access to docs. |

| Item | Result|
| --- | --- |
| Date | April 11, 2025 |
| Target | pizza.rundiary.click |
| Classification | Broken Access Control |
| Severity | 3 |
| Description | Free pizzas acquired by modifying the HTTP request. |
| Image | ![attack 17](attack17.png) ![attack 18](attack18.png) ![attack 19](attack19.png) |
| Corrections | Consider referencing database value instead fo request value. |

| Item | Result|
| --- | --- |
| Date | April 11, 2025 |
| Target | pizza.rundiary.click |
| Classification | Injection |
| Severity | None |
| Description | Attempted cross-site scripting. No effect. |
| Image | ![attack 20](attack20.png) |
| Corrections | None |

| Item | Result|
| --- | --- |
| Date | April 11, 2025 |
| Target | pizza.rundiary.click |
| Classification | Injection |
| Severity | None |
| Description | Attempted SQL injection. No effect. |
| Image | ![attack 21](attack21.png) |
| Corrections | None |

## Summary
We both found and protected against the vulnerabilites of the default admin login and SQL exploit in the updateUser endpoint. Through self-testing and fixing these vulnerabilities on our own applications, we learned to protect admin login credentials and the power of parameterized inputs for SQL statements.  
As we tested each other's applications, we were not able to penetrate either application in a significant way because we had both found and fixed the same vulnerabilites.
