from flask import Flask, render_template, request, redirect
import csv

app = Flask(__name__)

def write_file(data):
    with open('./error.txt', mode='a') as data_file:
        data_file.write('error occur\n')

def write_csv(data):
    with open('./database.csv', mode='a', newline='', encoding='utf-8') as data_file2:
        email = data.get('email', '')
        subject = data.get('subject', '')
        message = data.get('message', '')
        csv_writer = csv.writer(data_file2, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        csv_writer.writerow([email, subject, message])

@app.route('/')
def my_home_page():
    return render_template('index.html')

@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/<string:page_name>')
def html_page(page_name):
    return render_template(page_name)

@app.route('/submit_form', methods=['POST', 'GET'])
def submit_form():
    if request.method == 'POST':
        try:
            data = request.form.to_dict()
            write_csv(data)
            return redirect('/thank you.html')
        except:
            write_file('error occur')
            return 'Did not save to database.'
    else:
        return 'Something went wrong.'

if __name__ == '__main__':
    app.run(debug=True)
