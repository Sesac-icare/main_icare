import os
import time
import uuid
import requests
import base64
import json
import pandas as pd
from datetime import datetime

# Clova OCR API 설정
CLOVA_OCR_SECRET = "bFJwdVRobW9IdnRicHRmbGRHemNxVnpFenBjcXpHbXM="
OCR_API_URL = "https://3ja254nf6l.apigw.ntruss.com/custom/v1/38065/f6e2a7f6d39340c1a967762f8265e55ed0cf9e441f30ee185ba6a26df73d34db/general"

def call_clova_ocr(image_path):
    try:
        # 이미지 파일 읽기
        with open(image_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        # OCR API 요청
        timestamp = int(time.time() * 1000)
        payload = {
            "version": "V2",
            "requestId": str(uuid.uuid4()),
            "timestamp": timestamp,
            "lang": "ko",
            "images": [
                {
                    "format": "jpg",
                    "name": "prescription",
                    "data": image_data
                }
            ],
            "enableTableDetection": True
        }
        
        headers = {
            "Content-Type": "application/json",
            "X-OCR-SECRET": CLOVA_OCR_SECRET
        }
        
        print("API 요청 시작...")
        response = requests.post(OCR_API_URL, headers=headers, data=json.dumps(payload))
        print(f"API 응답 상태 코드: {response.status_code}")
        
        if response.status_code != 200:
            print(f"API 호출 실패: {response.text}")
            return None
            
        return response.json()
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def extract_table_from_ocr(ocr_result):
    table_data = []
    
    if ocr_result is None:
        return pd.DataFrame(table_data)
        
    for image in ocr_result.get("images", []):
        for table in image.get("tables", []):
            row_dict = {}
            
            for cell in table.get("cells", []):
                cell_text_lines = cell.get("cellTextLines", [])
                if not cell_text_lines:
                    continue
                
                cell_line = cell_text_lines[0]
                cell_words = cell_line.get("cellWords", [])
                if not cell_words:
                    continue
                
                cell_text = " ".join([word.get("inferText", "").strip() for word in cell_words])
                vertices = cell_line.get("boundingPoly", {}).get("vertices", [])
                if not vertices:
                    continue
                
                min_x = min(v.get("x", 0) for v in vertices)
                min_y = min(v.get("y", 0) for v in vertices)
                
                matched_row = None
                for row_y in row_dict.keys():
                    if abs(row_y - min_y) < 20:
                        matched_row = row_y
                        break
                
                if matched_row is None:
                    matched_row = min_y
                    row_dict[matched_row] = []
                
                row_dict[matched_row].append((min_x, cell_text))
            
            sorted_rows = []
            for row_y in sorted(row_dict.keys()):
                sorted_row = sorted(row_dict[row_y], key=lambda x: x[0])
                sorted_rows.append([text for _, text in sorted_row])
            
            table_data.extend(sorted_rows)
    
    return pd.DataFrame(table_data)

def main():
    # 테스트 실행
    image_path = 'C:/Users/pc/Desktop/project/icare/BackEndiCare/registerPrescription/testdata/IMG_8355.jpg'
    print("\n=== OCR 테스트 시작 ===\n")

    # OCR API 호출
    ocr_result = call_clova_ocr(image_path)
    if ocr_result:
        print("\n=== OCR 원본 응답 ===")
        print(json.dumps(ocr_result, ensure_ascii=False, indent=2))

    # 테이블 데이터 추출
    print("\n=== 테이블 데이터 추출 ===")
    table_df = extract_table_from_ocr(ocr_result)
    print(table_df)

    # 필요한 정보 추출
    result = {
        "약국명": "",
        "약국주소": "",
        "조제일자": "",
        "총수납금액": "",
        "약품목록": []
    }

    # 데이터 처리
    for _, row in table_df.iterrows():
        row_values = [str(val).strip() for val in row.values]
        row_str = ' '.join(row_values).lower()
        
        if '상호' in row_str:
            result['약국명'] = row.iloc[1] if len(row) > 1 else ""
        
        if '사업장소재지' in row_str:
            result['약국주소'] = row.iloc[1] if len(row) > 1 else ""
        
        if '조제일자' in row_str or '발행일' in row_str:
            result['조제일자'] = row.iloc[1] if len(row) > 1 else ""
        
        if '합계' in row_str:
            amount = row.iloc[1] if len(row) > 1 else "0"
            result['총수납금액'] = ''.join(filter(str.isdigit, str(amount)))
        
        if '약품명' in row_str or '약제명' in row_str:
            medicine = {
                "약품명": row.iloc[1] if len(row) > 1 else "",
                "투약량": row.iloc[2] if len(row) > 2 else "1",
                "투약횟수": row.iloc[3] if len(row) > 3 else "3",
                "투약일수": row.iloc[4] if len(row) > 4 else "3",
                "총투약수": 0
            }
            try:
                medicine["총투약수"] = int(medicine["투약횟수"]) * int(medicine["투약일수"])
            except:
                medicine["총투약수"] = 9
            result['약품목록'].append(medicine)

    print("\n=== 최종 추출 결과 ===")
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()