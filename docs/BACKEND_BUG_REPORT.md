# 백엔드 버그 리포트 - Sequelize 쿼리 에러

**작성일**: 2025년 11월 27일  
**작성자**: 프론트엔드 개발팀  
**우선순위**: 높음 (구성원 목록 조회 불가)

---

## 🐛 에러 내용

### 에러 메시지

**최신 에러:**

```
Unknown column 'userRoles.role_id' in 'on clause'
```

**이전 에러 (수정 후):**

```
Unknown column 'User->User.id' in 'field list'
```

### 발생 위치

- **API 엔드포인트**: `GET /api/users?page=1&limit=10`
- **파일**: `src/services/user/user.js`
- **함수**: `getMembersWithFilters` (535-563줄)

### 에러 발생 시나리오

1. 프론트엔드에서 구성원 목록 조회 요청 (`GET /api/users?page=1&limit=10`)
2. 백엔드에서 `getMembersWithFilters` 함수 실행
3. `models.User.findAll()` 쿼리 실행 시 Sequelize가 JOIN 절 생성
4. MySQL에서 `userRoles.role_id` 또는 `userRoles.organization_id` 컬럼을 찾을 수 없어 에러 발생

### 프론트엔드 요청 파라미터 (정상)

```javascript
{
  search: undefined,
  department: undefined,
  group: undefined,
  team: undefined,
  page: 1,
  limit: 10
}
```

**결론**: 프론트엔드에서 보내는 요청 파라미터는 정상입니다. 문제는 백엔드 Sequelize 쿼리 생성 로직에 있습니다.

---

## 🔍 문제 원인 분석

### 문제가 되는 코드 (최신 버전)

```javascript
// src/services/user/user.js (585-607줄)
const users = await models.User.findAll({
  where: {
    ...userWhere,
    id: { [Op.in]: filteredUserIds },
  },
  include: [
    {
      model: models.UserRole,
      as: 'userRoles',
      required: true,
      include: [
        {
          model: models.Organization,
          as: 'organization',
          required: true,
          where: organizationWhere,
          attributes: ['id', 'name'],
        },
      ],
      attributes: ['id', 'user_id', 'organization_id', 'role_id'],
    },
  ],
  // ...
});
```

### 원인

1. **모델 association 설정 문제**: `UserRole` 모델과 `Role` 모델 간의 association이 올바르게 설정되지 않았을 가능성
2. **JOIN 절 생성 오류**: Sequelize가 `UserRole`과 `Role`을 JOIN할 때 `userRoles.role_id` 컬럼을 찾지 못함
3. **테이블 alias 불일치**: Sequelize가 생성한 테이블 alias와 실제 컬럼 참조가 일치하지 않음

### 생성되는 잘못된 SQL (추정)

```sql
SELECT ...
FROM `users` AS `User`
INNER JOIN `user_role` AS `userRoles` ON `User`.`id` = `userRoles`.`user_id`
INNER JOIN `organization` AS `organization` ON `userRoles`.`organization_id` = `organization`.`id`
-- ❌ 문제: userRoles.role_id를 참조하려고 하지만 JOIN이 없음
WHERE ...
```

**문제점**: `UserRole` include에 `Role` 모델이 포함되지 않았는데, Sequelize가 `role_id`를 참조하려고 함

### 프론트엔드 요청 검증 결과

✅ **프론트엔드 요청은 정상입니다:**

- 요청 URL: `http://localhost:3000/api/users?page=1&limit=10`
- 요청 파라미터: `{page: 1, limit: 10}` (정상)
- HTTP 메서드: GET (정상)
- Content-Type: application/json (정상)

**결론**: 클라이언트 문제가 아닙니다. 백엔드 Sequelize 쿼리 생성 로직의 문제입니다.

---

## 💡 해결 방법 제안

### 방법 1: Role 모델 include 추가 (권장)

`UserRole` include에 `Role` 모델을 명시적으로 추가:

```javascript
const users = await models.User.findAll({
  where: {
    ...userWhere,
    id: { [Op.in]: filteredUserIds },
  },
  include: [
    {
      model: models.UserRole,
      as: 'userRoles',
      required: true,
      include: [
        {
          model: models.Organization,
          as: 'organization',
          required: true,
          where: organizationWhere,
          attributes: ['id', 'name'],
        },
        {
          model: models.Role, // ⚠️ 추가 필요
          as: 'role',
          required: false, // LEFT JOIN으로 변경 가능
          where: { is_deleted: false },
          attributes: ['id', 'name'],
        },
      ],
      attributes: ['id', 'user_id', 'organization_id', 'role_id'],
    },
  ],
  // ...
});
```

### 방법 2: 모델 association 확인

`UserRole` 모델의 association 설정 확인:

```javascript
// src/models/models.js에서 확인 필요
UserRole.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
UserRole.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });
UserRole.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
```

### 방법 3: attributes에서 role_id 제거 (임시 해결)

`role_id`를 attributes에서 제거하고, 필요시 별도로 조회:

```javascript
attributes: ['id', 'user_id', 'organization_id']; // role_id 제거
```

### 방법 4: 서브쿼리 사용 (성능 고려)

필터링된 user_id로 먼저 조회한 후, 필요한 정보만 추가 조회:

```javascript
// 이미 filteredUserIds가 있으므로, UserRole을 별도로 조회
const userRoles = await models.UserRole.findAll({
  where: {
    user_id: { [Op.in]: filteredUserIds },
  },
  include: [
    {
      model: models.Role,
      as: 'role',
      attributes: ['id', 'name'],
    },
    {
      model: models.Organization,
      as: 'organization',
      where: organizationWhere,
      attributes: ['id', 'name'],
    },
  ],
});

// 메모리에서 조합
```

---

## 📋 확인 사항

1. **UserRole 모델의 association 설정**: `UserRole`과 `Role` 모델 간의 `belongsTo` 관계가 올바르게 설정되었는지 확인
2. **데이터베이스 스키마**: `user_role` 테이블에 `role_id` 컬럼이 실제로 존재하는지 확인
3. **Sequelize 모델 정의**: `UserRole` 모델의 `role_id` foreignKey 설정 확인
4. **모델 alias 일치**: include에서 사용하는 `as: "role"`과 모델 정의의 alias가 일치하는지 확인

### 확인해야 할 파일

- `src/models/models.js`: 모델 association 설정
- `src/models/userRole.js` (또는 유사 파일): UserRole 모델 정의
- 데이터베이스 스키마: `user_role` 테이블 구조

---

## 🧪 테스트 방법

1. 백엔드 서버 재시작
2. 프론트엔드에서 구성원 목록 조회 요청
3. 에러 없이 정상적으로 데이터가 반환되는지 확인

---

## 📞 문의

문제 해결 후 프론트엔드 개발팀에 알려주시면 테스트 진행하겠습니다.
