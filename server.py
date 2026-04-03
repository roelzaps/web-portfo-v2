from flask import Flask, render_template, request, redirect
import csv
from twilio.rest import Client
import os
from twilio.http.http_client import TwilioHttpClient

app = Flask(__name__)
print(__name__)

# proxy configuration
proxy_client = TwilioHttpClient(
    proxy={'http': os.environ['http_proxy'], 'https': os.environ['https_proxy']})

# SMS configuration
account_sid = ''  # you can see this in twilio account
auth_token = ''  # you can see this in twilio account
client = Client(account_sid, auth_token, http_client=proxy_client)


def write_file(data):
    with open('./error.txt', mode='a') as data_file:

        data_file.write('error occur')


def write_csv(data):
    with open('./database.csv', mode='a', newline='') as data_file2:
        email = data['email']
        subject = data['subject']
        message = data['message']
        csv_writer = csv.writer(data_file2, delimiter=',',
                                quotechar='"', quoting=csv.QUOTE_MINIMAL)
        csv_writer.writerow([email, subject, message])
        # twilio messaging format
        try:
            message = client.messages \
                            .create(
                                body=f"You have new website query from {data['email']} and the message is {data['message']}",
                                from_='+12077165274',
                                to='+639177999041'
                            )
        except:
            write_file('error occur')


@app.route('/')
def my_home_page():
    # this will look for html file inside the folder "templates"
    return render_template('index.html')


@app.route('/index.html')
def index():
    # this will look for html file inside the folder "templates"
    return render_template('index.html')


@app.route('/<string:page_name>')
def html_page(page_name):
    # this will look for html file inside the folder "templates"
    return render_template(page_name)


@app.route('/submit_form', methods=['POST', 'GET'])
def submit_form():
    if request.method == 'POST':
        data = request.form.to_dict()
        write_csv(data)

        return redirect('/thank you.html')
    else:
        print('somthing went wrong')
