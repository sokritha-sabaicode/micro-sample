EPIC: authentication-v1
STORIES: USER STORIES

- As a user, I want to signup so that I can access the platform

  # Validate and sanitize input from the user

  # Encrypt provided password

  # Save the user information to the database

  # Send verification email to the provided user email

  # Send appropriate response to the user

- As a user, I want to verify my sign
  up information, so that I can confirm a real user

  # Decode verification key from the provided url

  # Look for the user with the corresponding key

  # Mark the user as verified in the system

  # Send Appropriate Response to the user

- As a user, I want to sign in so that I can access the platform multiple times

- As a user, I want to sign out so that I can leave the platform safely

=====================================================
Test Driven Development (TDD)

- Should write business requirement first
- Begin -> Write Test -> Test will Fail -> Write code that the test passes -> Test passes (lifecycle)
- Three laws of TDD:
  - You are not allowed to write any production code unless it is to make a failing unit test pass


How to Generate RSA Private Key
- openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
Extract the Public Key From Private Key
- openssl rsa -pubout -in private_key.pem -out public_key.pem
