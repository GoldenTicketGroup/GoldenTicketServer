# GoldenTicket_project_server

## <**GoldenTicket**>

2019 SOPT 24기 
당일 공연 추첨식 예매 서비스 **골든 티켓**입니다.
***

* 프로젝트 기간 : 2019년 6월 29일 ~ 2019년 7월 12일
* **API** - (https://github.com/GoldenTicketGroup/GoldenTicketServer/wiki)

## Work Flow
![워크 플로우](https://sopt24server.s3.ap-northeast-2.amazonaws.com/workflow.png)

## Server Architecture
![서버 아키텍처](https://sopt24server.s3.ap-northeast-2.amazonaws.com/ERD.png)

## Entity Relationship Diagram
![ERD](https://sopt24server.s3.ap-northeast-2.amazonaws.com/architecture.png)


## Dependencies

```
"dependencies": {
    "aws-sdk": "^2.485.0",
    "cookie-parser": "~1.4.3",
    "csvtojson": "^2.0.10",
    "debug": "~2.6.9",
    "express": "~4.16.0",
    "http-errors": "~1.6.2",
    "jade": "~1.11.0",
    "json2csv": "^4.5.1",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.24.0",
    "morgan": "~1.9.0",
    "multer": "^1.4.1",
    "multer-s3": "^2.9.0",
    "node-cron": "^2.0.3",
    "nodemon": "^1.19.1",
    "promise-mysql": "^4.0.4",
    "rand-token": "^0.4.0"
  }
```
 
## 시작하기

모든 소스코드는 vscode+ Windows10/MAC + Node.js 10 환경에서 작성되었습니다.

- Node.js의 Async/Await 도구를 사용해 (Promise) 비동기 제어를 하고 있습니다.
- Node.js의 버전을 7.6 이상으로 유지해야 합니다.

### 설치하기

- `nodejs` 와 `npm` 을 설치합니다. 설치 방법은 [nodejs.org](https://nodejs.org) 를 참고하세요.
- Node.js 8 LTS 버전을 설치합니다.
- 실행에 필요한 의존성을 설치합니다.

```
  npm install
```

### 실행하기

```
  npm start
```

- `localhost:3000`으로 접속이 가능합니다

### AWS EC2 실행 하기

- `nodejs` 와 `npm` 을 설치합니다. 설치 방법은 [nodejs.org](https://nodejs.org) 를 참고하세요.
- Node.js 8 LTS 버전을 설치합니다.

- 실행에 필요한 의존성을 설치합니다.

```
  npm install
```

### 실행하기

- Express 앱용 프로세스 관리자 `pm2 `를 이용해 배포 합니다.

```
  npm install pm2 -g
```

- Express 앱용 프로세스 관리자 `pm2 `를 이용해 배포 합니다.

```
  pm2 start ./bin/www --name "앱 이름"
```

- 현재 실행중인 프로세스 목록을 확인 합니다.

```
  pm2 list
```

- 프로세스를 중지 합니다.

```
  pm2 delete --name "앱 이릅"
```

- 프로세스를 모니터 합니다.

```
  pm2 moni t --name "앱 이름"
```

- `ec2_ip:3000`으로 접속이 가능합니다

## 배포

- AWS EC2 - 애플리케이션 서버
- AWS RDS - db 서버
- AWS S3 - 저장소 서버

## 사용된 도구

- [Node.js](https://nodejs.org/ko/) - Chrome V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임
- [Express.js](http://expressjs.com/ko/) - Node.js 웹 애플리케이션 프레임워크
- [NPM](https://rometools.github.io/rome/) - 자바 스크립트 패키지 관리자
- [PM2](http://pm2.keymetrics.io/) - Express 앱용 프로세스 관리자
- [vscode](https://code.visualstudio.com/) - 편집기
- [Mysql](https://www.mysql.com/) - DataBase
- [AWS EC2](https://aws.amazon.com/ko/ec2/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_ec2_b&sc_content=ec2_e&sc_detail=aws%20ec2&sc_category=ec2&sc_segment=177228231544&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177228231544!e!!g!!aws%20ec2&ef_id=WkRozwAAAnO-lPWy:20180412120123:s) - 클라우드 환경 컴퓨팅 시스템
- [AWS RDS](https://aws.amazon.com/ko/rds/) - 클라우드 환경 데이터베이스 관리 시스템
- [AWS S3](https://aws.amazon.com/ko/s3/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_s3_b&sc_content=s3_e&sc_detail=aws%20s3&sc_category=s3&sc_segment=177211245240&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177211245240!e!!g!!aws%20s3&ef_id=WkRozwAAAnO-lPWy:20180412120059:s) - 클라우드 환경 데이터 저장소

## 사용 모듈
- [Async & Await](https://www.npmjs.com/package/async)
- [node-cron](https://www.npmjs.com/package/node-schedule) : 스케줄링
- [JWT(JsonWebTokens)](https://www.npmjs.com/package/jsonwebtoken)
- [multer](https://github.com/expressjs/multer)

## 개발자

- **윤희성** - [HeeSungee(**samsungMan**)](https://github.com/heesung6701) 
- **최민경** - [MingKyonee](https://github.com/dquoupb) 
- **황재석** - [JaeSeogie*>_<*](https://github.com/jaesukhwang95)


- [기여자 목록](https://github.com/GoldenTicketGroup/GoldenTicketServer/graphs/contributors)


## **GoldenTicket**의 다른 프로젝트팀

- [ANDROID](https://github.com/GoldenTicketGroup/GoldenTicket_Android) 
- [IOS](https://github.com/GoldenTicketGroup/GoldenTicket_iOS) 


### SPECIAL THANKS TO **★김현진★ 서버 파트장님**

