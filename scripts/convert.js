const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const inputFile = path.join(__dirname, '../data/3_2026-1 파견기관자료.xlsx - ESP(교환학생, 영어권).csv');
const outputFile = path.join(__dirname, '../public/data.json');

const results = [];

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    
    const filtered = {
      "연번": row["연번"],
      "강의언어": row["강의언어"],
      "파견기관": row["파견기관"],
      "대륙": row["대륙"],
      "국가": row["국가"],
      "소재도시": (row["소재도시"] || '').replace(/\n/g, ' '),
      "CGPA": row["CGPA"],
      "어학 기준(총점)": row["어학 기준(총점)"],
      "TOEFL My Best Score 인정 여부": row["TOEFL My Best Score 인정 여부"],
      "파견인원(학기당)": row["파견인원(학기당)"],
      "학부/대학원": row["학부/대학원"],
      "전공제한": row["전공제한"],
      "학기제한": row["학기제한"],
      "관련 웹사이트": row["관련 웹사이트"],
      "학사력": row["학사력"],
      "비고": row["비고"],
      "업데이트 이력": row["업데이트 이력"],
      "최종 업데이트 일자": row["최종 업데이트 일자"],
    };
    results.push(filtered);
  })
  .on('end', () => {
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log('CSV → JSON 변환 완료 (필터링 및 key 변경 포함)');
  });
