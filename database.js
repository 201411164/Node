// 계정 테이블, 상품 테이블, 프록시 테이블, 로그 테이블, 미드와 키워드 테이블의 CRUD를 수행하는 함수들를 정의한다.

//   // 프록시 데이터베이스 테이블 생성
//   db.serialize(function() {
//     db.run("CREATE TABLE IF NOT EXISTS proxies (proxyHost TEXT, proxyPort INTEGER, proxyUser TEXT, proxyPass TEXT)");
//   });

// 미드와 키워드 데이터베이스 테이블 생성
// db.serialize(function() {
//     db.run("CREATE TABLE IF NOT EXISTS midAndKeywords (keywordId TEXT, loginId TEXT, usernvmid TEXT, keyword TEXT)");
//   });

//   // 계정 테이블 생성
//   db.serialize(function() {
//   db.run("CREATE TABLE IF NOT EXISTS accounts (loginId TEXT, password TEXT, name TEXT, phoneNumber TEXT, createdAt TEXT, productId INTEGER, FOREIGN KEY(productId) REFERENCES products(productId))");
//   });

//   // 상품 테이블 생성
//   db.serialize(function() {
//   db.run("CREATE TABLE IF NOT EXISTS products (productId INTEGER PRIMARY KEY, productCode TEXT, price REAL, startDate TEXT, endDate TEXT, paymentDate TEXT)");
//   });
  
//   //로그 테이블 생성
//   db.serialize(function() {
//   db.run("CREATE TABLE IF NOT EXISTS logs (logId INTEGER PRIMARY KEY, loginId TEXT, productId INTEGER, proxyHost TEXT, proxyPort INTEGER, ipAddress, access_time TEXT, accessUrl TEXT, keyword TEXT, mid TEXT, stayTime INTEGER)");
//   });

// test.js 파일에서 이 파일을 불러와서 사용한다.
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
var axios = require('axios');

module.exports = {
    db,
    createProxy,
    readProxy,
    updateProxy,
    deleteProxy,
    createAccount,
    readAccount,
    updateAccount,
    deleteAccount,
    createProduct,
    readProduct,
    updateProduct,
    deleteProduct,
    createLog,
    readLog,
    updateLog,
    deleteLog,
    createMidAndKeyword,
    readMidAndKeyword,
    updateMidAndKeyword,
    deleteMidAndKeyword,
    insertTable,
    selectTable,
    setUpDatabase
}



// 프록시 테이블의 CRUD
function createProxy(proxyHost, proxyPort, proxyUser, proxyPass) {
    db.serialize(function() {
        db.run('INSERT INTO proxies VALUES (?, ?, ?, ?)', proxyHost, proxyPort, proxyUser, proxyPass, function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`행 추가됨 ${proxyHost}`);
        });
    });
}

function readProxy(proxyHost) {
    db.serialize(function() {
        db.all('SELECT * FROM proxies WHERE proxyHost = ?', proxyHost, function(err, rows) {
            if (err) {
                return console.log(err.message);
            }
            console.log(rows);
        });
    });
}

function updateProxy(proxyHost, proxyPort, proxyUser, proxyPass) {
    db.serialize(function() {
        db.run('UPDATE proxies SET proxyPort = ?, proxyUser = ?, proxyPass = ? WHERE proxyHost = ?', proxyPort, proxyUser, proxyPass, proxyHost, function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`행 수정됨 ${proxyHost}`);
        });
    });
}


function deleteProxy(proxyHost) {
    db.serialize(function() {
        db.run('DELETE FROM proxies WHERE proxyHost = ?', proxyHost, function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`행 삭제됨 ${proxyHost}`);
        });
    });
}

// 계정 테이블의 CRUD
function createAccount(loginId, password, name, phoneNumber, createdAt, productId) {
    db.serialize(function() {
      db.run('INSERT INTO accounts VALUES (?, ?, ?, ?, ?, ?)', loginId, password, name, phoneNumber, createdAt, productId, function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`행 추가됨 ${loginId}`);
      });
    });
  
  }
  
function readAccount(loginId) {
db.serialize(function() {
    db.all('SELECT * FROM accounts WHERE loginId = ?', loginId, function(err, rows) {
    if (err) {
        return console.log(err.message);
    }
    console.log(rows);
    });
});
}

function updateAccount(loginId, password, name, phoneNumber, createdAt, productId) {
db.serialize(function() {
    db.run('UPDATE accounts SET password = ?, name = ?, phoneNumber = ?, createdAt = ?, productId = ? WHERE loginId = ?', password, name, phoneNumber, createdAt, productId, loginId, function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`행 수정됨 ${loginId}`);
    });
});
}

function deleteAccount(loginId) {
db.serialize(function() {
    db.run('DELETE FROM accounts WHERE loginId = ?', loginId, function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`행 삭제됨 ${loginId}`);
    });
});
}

// 미드와 키워드 테이블의 CRUD
function createMidAndKeyword(keywordId, loginId, usernvmid, keyword) {
db.serialize(function() {
    db.run('INSERT INTO midAndKeywords VALUES (?, ?, ?, ?)', keywordId, loginId, usernvmid, keyword, function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`행 추가됨 ${keywordId}`);
    });
});

}

function readMidAndKeyword(keywordId) {
db.serialize(function() {
    db.all('SELECT * FROM midAndKeywords WHERE keywordId = ?', keywordId, function(err, rows) {
    if (err) {
        return console.log(err.message);
    }
    console.log(rows);
    });
});
}

function updateMidAndKeyword(keywordId, loginId, usernvmid, keyword) {
db.serialize(function() {
    db.run('UPDATE midAndKeywords SET loginId = ?, usernvmid = ?, keyword = ? WHERE keywordId = ?', loginId, usernvmid, keyword, keywordId, function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`행 수정됨 ${keywordId}`);
    });
});
}

function deleteMidAndKeyword(keywordId) {
db.serialize(function() {
    db.run('DELETE FROM midAndKeywords WHERE keywordId = ?', keywordId, function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`행 삭제됨 ${keywordId}`);
    });
});
}



// 상품 테이블의 CRUD
function createProduct(productCode, price, startDate, endDate, paymentDate) {
db.serialize(function() {
    db.run('INSERT INTO products VALUES (?, ?, ?, ?, ?, ?)', productCode, price, startDate, endDate, paymentDate, function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`행 추가됨 ${productCode}`);
    });
});
}

function readProduct(productCode) {
db.serialize(function() {
    db.all('SELECT * FROM products WHERE productCode = ?', productCode, function(err, rows) {
    if (err) {
        return console.log(err.message);
    }
    console.log(rows);
    });
});
}

function updateProduct(productCode, price, startDate, endDate, paymentDate) {
db.serialize(function() {
    db.run('UPDATE products SET price = ?, startDate = ?, endDate = ?, paymentDate = ? WHERE productCode = ?', price, startDate, endDate, paymentDate, productCode, function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`행 수정됨 ${productCode}`);
    });
});
}

function deleteProduct(productCode) {
db.serialize(function() {
    db.run('DELETE FROM products WHERE productCode = ?', productCode, function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`행 삭제됨 ${productCode}`);
    });
});
}

// 로그 테이블의 CRUD

function createLog(loginId, productId, proxyHost, proxyPort, ipAddress, access_time, accessUrl, keyword, mid, stayTime) {
    db.serialize(function() {
    db.run("INSERT INTO logs (loginId, productId, proxyHost, proxyPort, ipAddress, access_time, accessUrl, keyword, mid, stayTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
           loginId, productId, proxyHost, proxyPort, ipAddress, access_time, accessUrl, keyword, mid, stayTime, function(err) {
             if (err) {
               console.log(err.message);
             } else {
               console.log("A new log has been added with id " + this.lastID);
             }
           });
    });
  }

function readLog(loginId) {
db.serialize(function() {
    db.all('SELECT * FROM logs WHERE loginId = ?', loginId, function(err, rows) {
    if (err) {
        return console.log(err.message);
    }
    console.log(rows);
    });
});

}

function updateLog(loginId, productId, proxyHost, proxyPort, ipAddress, access_time, accessUrl, keyword, mid, stayTime) {
db.serialize(function() {
    db.run('UPDATE logs SET productId = ?, proxyHost = ?, proxyPort = ?, ipAddress = ?, access_time = ?, accessUrl = ?, keyword = ?, mid = ?, stayTime = ? WHERE loginId = ?', productId, proxyHost, proxyPort, ipAddress, access_time, accessUrl, keyword, mid, stayTime, loginId, function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`행 수정됨 ${loginId}`);
    });
});
}

function deleteLog(loginId) {
db.serialize(function() {
    db.run('DELETE FROM logs WHERE loginId = ?', loginId, function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`행 삭제됨 ${loginId}`);
    });
});

}



// 미드와 키워드 테이블의 CRUD



function setUpDatabase(){

    const url = "https://api.asocks.com/v2/proxy/ports";
    const apiKey = "Vqtab8brLo3l1g7tMyqqsLzf50VFrxptHvsFdexoYEUPmvbHYDzMRXMVwlRxj1bU";
    let result = '';
    
    // DB 생성 또는 열기, 생성했을 경우와 기존 걸 열었을 경우 다른 메시지 출력              
    
    
    // 프록시 데이터베이스 테이블 생성
    db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS proxies (proxyHost TEXT, proxyPort INTEGER, proxyUser TEXT, proxyPass TEXT)");
    });
  
    // 미드와 키워드 데이터베이스 테이블 생성
    db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS midAndKeywords (keywordId TEXT, loginId TEXT, usernvmid TEXT, keyword TEXT)");
    });
  
    // 계정 테이블 생성
    db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS accounts (loginId TEXT, password TEXT, name TEXT, phoneNumber TEXT, createdAt TEXT, productId INTEGER, FOREIGN KEY(productId) REFERENCES products(productId))");
    });
  
    // 상품 테이블 생성
    db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS products (productId INTEGER PRIMARY KEY, productCode TEXT, price REAL, startDate TEXT, endDate TEXT, paymentDate TEXT)");
    });
    
    //로그 테이블 생성
    db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS logs (logId INTEGER PRIMARY KEY, loginId TEXT, productId INTEGER, proxyHost TEXT, proxyPort INTEGER, ipAddress, access_time TEXT, accessUrl TEXT, keyword TEXT, mid TEXT, stayTime INTEGER)");
    });
  
    // 미드와 키워드 데이터베이스 테이블 인서트
    const MidAndKeywords= [
      {
        usernvmid: '85722666793',
        keyword: '레지스탕스쿠',
      },
      {
        usernvmid: '85750962168',
        keyword: '고양이 원룸 티스푼',
      },
      {
        usernvmid: '85722666793',
        keyword: '보드게임쿠',
      },
      {
        usernvmid: '85750962168',
        keyword: '원룸 고양이 티스푼',
      },
      {
        usernvmid: '85750962168',
        keyword: '티스푼 원룸 고양이',
      },
    ]

    // 계정 데이터베이스 테이블 인서트
    const Accounts = [
        {
            loginId: 'test',
            password: 'test',
            name: 'test',
            phoneNumber: '010-0000-0000',
            createdAt: '2021-01-01',
            productId: 1,
        },
    ]

    // 상품 데이터베이스 테이블 인서트
    const Products = [
        {
            productId: 1,
            productCode: 'test',
            price: 10000,
            startDate: '2021-01-01',
            endDate: '2021-01-01',
            paymentDate: '2021-01-01',
        },
    ]

    // 계정 데이터베이스 테이블 인서트
    db.serialize(function() {
        for (let i = 0; i < Accounts.length; i++) {
            db.run("INSERT INTO accounts (loginId, password, name, phoneNumber, createdAt, productId) VALUES (?, ?, ?, ?, ?, ?)", Accounts[i].loginId, Accounts[i].password, Accounts[i].name, Accounts[i].phoneNumber, Accounts[i].createdAt, Accounts[i].productId);
        }
    });

    // 상품 데이터베이스 테이블 인서트
    db.serialize(function() {
        for (let i = 0; i < Products.length; i++) {
            db.run("INSERT INTO products (productId, productCode, price, startDate, endDate, paymentDate) VALUES (?, ?, ?, ?, ?, ?)", Products[i].productId, Products[i].productCode, Products[i].price, Products[i].startDate, Products[i].endDate, Products[i].paymentDate);
        }
    });
      
    // 미드와 키워드 데이터베이스 테이블 인서트, loginId는 'test'로 우선 고정
    db.serialize(function() {
        for (let i = 0; i < MidAndKeywords.length; i++) {
            db.run("INSERT INTO midAndKeywords (loginId, usernvmid, keyword) VALUES (?, ?, ?)", 'test', MidAndKeywords[i].usernvmid, MidAndKeywords[i].keyword);
        }
    });


      
    console.log('db created')
    
    let responseData;
    const dataPairs = [];
    
    var config = {
      method: 'get',
    maxBodyLength: Infinity,
      url: 'https://api.asocks.com/v2/proxy/ports',
      headers: { 
        'Authorization': 'Bearer Vqtab8brLo3l1g7tMyqqsLzf50VFrxptHvsFdexoYEUPmvbHYDzMRXMVwlRxj1bU', 
        'Accept': 'application/json'
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      responseData = JSON.stringify(response.data.message);
      responseData = JSON.parse(responseData);
      console.log('responseData')
      console.log(responseData)
      console.log('responseData.proxies')
      console.log(responseData.proxies)
  
      // db transaction 시작
      db.run("BEGIN TRANSACTION");
  
      responseData.proxies.forEach((proxyElem) => {
        
        let proxy = proxyElem.proxy.split(':')[0];
        let port = proxyElem.proxy.split(':')[1];
        let login = proxyElem.login;
        let password = proxyElem.password;
        console.log(proxy, port, login, password)
        dataPairs.push(proxy, port, login, password);
        // db에 데이터 입력
        db.run("INSERT INTO proxies VALUES (?, ?, ?, ?)", proxy, port, login, password, function(err) {
          if (err) {
            return console.log(err.message);
          }
          console.log(`프록시 행 추가됨 ${proxy}`);
        });
        // 커밋
        
  
      })
      // db transaction 종료
      db.run("END TRANSACTION");
      
      
    })
    .catch(function (error) {
      console.log(error);
    });  
    
    
    //db 전체 행수를 출력한다.
    db.get("SELECT COUNT(*) AS total FROM proxies", function(err, row) {
      if (err) {
        console.error(err.message);
      }
      console.log("Total: " + row.total);
    });
    
      //만약 row수가 0 이상이면 db를 출력한다.
    
    if (db.get("SELECT COUNT(*) AS total FROM proxies", function(err, row) {
      
    db.each("SELECT rowid AS id, proxyHost, proxyPort, proxyUser, proxyPass FROM proxies where proxyPass not null", function(err, row) {
      if (err) {
        console.error(err.message);
      }
      console.log(row.id + "\t" + row.proxyHost + "\t" + row.proxyPort + "\t" + row.proxyUser + "\t" + row.proxyPass);
    });
    }));  
    
    console.log('db finished')
  
  }

// 테이블 생성
function createTable() {
db.serialize(function() {
    db.run('CREATE TABLE IF NOT EXISTS accounts (loginId TEXT, password TEXT, name TEXT, phoneNumber TEXT, createdAt TEXT, productId TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS products (productCode TEXT, price TEXT, startDate TEXT, endDate TEXT, paymentDate TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS logs (loginId TEXT, productId TEXT, access_time TEXT, accessUrl TEXT, keyword TEXT, mid TEXT, stayTime TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS midAndKeywords (mid TEXT, keyword TEXT)');
});
}

// 테이블 삭제
function dropTable() {
db.serialize(function() {
    db.run('DROP TABLE accounts');
    db.run('DROP TABLE products');
    db.run('DROP TABLE logs');
    db.run('DROP TABLE midAndKeywords');
});
}

// 테이블 초기화
function initTable() {
db.serialize(function() {
    db.run('DELETE FROM accounts');
    db.run('DELETE FROM products');
    db.run('DELETE FROM logs');
    db.run('DELETE FROM midAndKeywords');
});
}

// 테이블 조회
function selectTable() {
db.serialize(function() {
    db.all('SELECT * FROM accounts', function(err, rows) {
    if (err) {
        return console.log(err.message);
    }
    console.log(rows);
    });
    db.all('SELECT * FROM products', function(err, rows) {
    if (err) {
        return console.log(err.message);
    }
    console.log(rows);
    });
    db.all('SELECT * FROM logs', function(err, rows) {
    if (err) {
        return console.log(err.message);
    }
    console.log(rows);
    });
    db.all('SELECT * FROM midAndKeywords', function(err, rows) {
    if (err) {
        return console.log(err.message);
    }
    console.log(rows);
    });
});
}

// 테이블 삽입
function insertTable() {
createAccount('test', 'test', 'test', 'test', 'test', 'test');
createProduct('test', 'test', 'test', 'test', 'test');
createLog('test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test');
createMidAndKeyword('test', 'test');
}

