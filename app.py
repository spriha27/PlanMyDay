from openai import OpenAI

client = OpenAI('sk-vjjTGPbh9GZ0-I17KmuuKcPIvi3LUmAXz3ZeYQQWPbT3BlbkFJLatiFDD1asU2VPhTwekTGxNfttm4u20FiH7uzR7ZkA')

# TODO: The 'openai.my_api_key' option isn't read in the client API. You will need to pass it when you instantiate the client, e.g. 'OpenAI(my_api_key='sk-vjjTGPbh9GZ0-I17KmuuKcPIvi3LUmAXz3ZeYQQWPbT3BlbkFJLatiFDD1asU2VPhTwekTGxNfttm4u20FiH7uzR7ZkA')'
# openai.my_api_key = 'sk-vjjTGPbh9GZ0-I17KmuuKcPIvi3LUmAXz3ZeYQQWPbT3BlbkFJLatiFDD1asU2VPhTwekTGxNfttm4u20FiH7uzR7ZkA'
messages = [ {"role": "system", "content":
    "You are a intelligent assistant."} ]
while True:
    message = input("User : ")
    if message:
        messages.append(
            {"role": "user", "content": message},
        )
        chat = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages)
    reply = chat.choices[0].message.content
    print(f"ChatGPT: {reply}")
    messages.append({"role": "assistant", "content": reply})
