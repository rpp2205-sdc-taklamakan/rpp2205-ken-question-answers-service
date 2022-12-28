CREATE TABLE productId (
  id SERIAL PRIMARY KEY ,
  productName VARCHAR(30),
  slogan VARCHAR(100),
  productDescription VARCHAR(600),
  category VARCHAR(50),
  defaultPrice INTEGER
);

CREATE TABLE Question (
  idQuestion SERIAL PRIMARY KEY,
  body VARCHAR(300),
  date VARCHAR(30),
  askerName VARCHAR(50),
  askerEmail VARCHAR(50),
  reported INTEGER,
  helpfulness INTEGER,
  productId INTEGER,
    FOREIGN KEY (productId)
      REFERENCES productId(id)
);


CREATE TABLE Answers (
  idAnswer SERIAL PRIMARY KEY,
  body VARCHAR(255),
  date VARCHAR(30),
  answererName VARCHAR(50),
  answererEmail VARCHAR(50),
  reported INTEGER,
  helpfulness INTEGER,
  questionId INTEGER,
    FOREIGN KEY (questionId)
      REFERENCES Question(idQuestion)
);

CREATE TABLE answerPhotos (
  idPhoto SERIAL PRIMARY KEY,
  url VARCHAR(200),
  answerId INTEGER,
    FOREIGN KEY (answerId)
      REFERENCES Answers(idAnswer)
);



CREATE INDEX questProdIndex ON Question(productId);
CREATE INDEX questAnsIndex ON Answers(questionId);
CREATE INDEX AnsPhoIndex ON answerPhotos(answerId);

CLUSTER Question USING questProdIndex;
CLUSTER Answers USING questAnsIndex;
CLUSTER answerPhotos USING AnsPhoIndex;

CLUSTER Question;
CLUSTER Answers;
CLUSTER answerPhotos;

CLUSTER;


