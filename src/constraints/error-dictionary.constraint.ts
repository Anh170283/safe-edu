export enum ERRORS_DICTIONARY {
  // AUTH
  EMAIL_EXISTED = 'ATH_0091',
  WRONG_CREDENTIALS = 'ATH_0001',
  CONTENT_NOT_MATCH = 'ATH_0002',
  UNAUTHORIZED_EXCEPTION = 'ATH_0011',

  // TOPIC
  TOPIC_NOT_FOUND = 'TOP_0041',

  // USER
  USER_NOT_FOUND = 'Người dùng không tồn tại',
  
  // CITIZEN
  CITIZEN_PHONE_NUMBER_EXISTS = 'Số điện thoại đã tồn tại',
  CITIZEN_NAME_IS_NULL = 'Tên người dân không được để trống',
  CITIZEN_NOT_FOUND = 'Người dân không tồn tại',

  //STUDENT
  STUDENT_PHONE_NUMBER_EXISTS = 'Số điện thoại đã tồn tại',
  STUDENT_NAME_IS_NULL = 'Tên học sinh không được để trống',
  STUDENT_NOT_FOUND = 'Học sinh không tồn tại',

  //ORGANIZATION
  ORGANIZATION_NAME_EXISTS = 'Tên trường đã tồn tại',
  ORGANIZATION_NAME_NOT_FOUND = 'Tên trường không tồn tại',
  ORGANIZATION_NAME_CAN_NOT_BE_EMPTY = 'Tên trường không được để trống',
  ORGANIZATION_PROVINCE_CAN_NOT_BE_EMPTY = 'Tên tình/ thành phố không được để trống',
  ORGANIZATION_NOT_FOUND = 'Trường không tồn tại',

  // CLASS VALIDATOR
  VALIDATION_ERROR = 'Lỗi Validate',
}
