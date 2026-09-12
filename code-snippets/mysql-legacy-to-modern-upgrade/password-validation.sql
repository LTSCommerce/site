-- Install and configure password validation
INSTALL COMPONENT 'file://component_validate_password';

SET GLOBAL validate_password.length = 12;
SET GLOBAL validate_password.mixed_case_count = 1;
SET GLOBAL validate_password.special_char_count = 1;
