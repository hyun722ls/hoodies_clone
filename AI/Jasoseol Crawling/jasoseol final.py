# 자소설 접속, 팝업 배너 닫고, IT 직무 인기 채용공고 탭 클릭까지의 과정
# 같은 루트 디렉토리 내에 chromedriver.exe 파일이 함께 있어야합니다.
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains
from selenium.common.exceptions import NoSuchElementException, TimeoutException

webdriver_options = webdriver.ChromeOptions()
webdriver_options.add_argument('headless')

driver = webdriver.Chrome('chromedriver.exe', chrome_options=webdriver_options)
action = ActionChains(driver)
driver.implicitly_wait(2)

driver.get('https://jasoseol.com/')
driver.find_element(By.XPATH, '/html/body/div/div[1]/div/div/div[2]/div[1]').click()
driver.find_element(By.XPATH, '/html/body/div/div/div[2]/div[7]/div/div[2]/div[4]/span').click()

result = {}
data = []
for i in range(1, 9):
    try:
        logo_url = driver.find_element(By.XPATH, f'/html/body/div/div/div[2]/div[7]/div/div[3]/div[{i}]/div[1]/img').get_attribute('src')
        company_name = driver.find_element(By.XPATH, f'/html/body/div/div/div[2]/div[7]/div/div[3]/div[{i}]/div[2]/div[1]').text
        job = driver.find_element(By.XPATH, f'/html/body/div/div/div[2]/div[7]/div/div[3]/div[{i}]/div[2]/div[2]').text
        due_date = driver.find_element(By.XPATH, f'/html/body/div/div/div[2]/div[7]/div/div[3]/div[{i}]/div[2]/div[3]').text
        data.append({
            'companyName': company_name,
            'job': job,
            'logoURL': logo_url,
            'applicants': due_date[0:7].rstrip('ㆍ'),
            'dueDate': due_date[-6:-3].lstrip('ㆍ') + ' 남음'
        })
    except NoSuchElementException:
        continue
result['data'] = data
json_result = json.dumps(result, indent=2, ensure_ascii=False)
print(json_result)
