// public/index.js
function inUserText(text,key,button){
    if(text){
        const newElement = document.createElement('li');
        newElement.innerHTML = text;
        newElement.classList.add('user-name',key);
        document.querySelector('.user-list').appendChild(newElement);
        document.querySelector(button).value = '';
    }
}
function inDayText(text,key,button){
  if(text){
      const newElement = document.createElement('li');
      newElement.innerHTML = text;
      newElement.classList.add('user-birthday',key);
      document.querySelector('.day-list').appendChild(newElement);
      document.querySelector(button).value = '';
  }
}
function inTelText(text,key,button){
  if(text){
      const newElement = document.createElement('li');
      newElement.innerHTML = text;
      newElement.classList.add('user-number',key);
      document.querySelector('.tel-list').appendChild(newElement);
      document.querySelector(button).value = '';
  }
}
function inKeyText(text,button){
  if(text){
      const newElement = document.createElement('li');
      newElement.innerHTML = text;
      newElement.classList.add('user-key',text);
      document.querySelector('.key-list').appendChild(newElement);
      document.querySelector(button).value = '';
  }
}


function removeUserText(text,textbox){
    if(text){
        document.querySelectorAll('.user-list li').forEach((value)=>{
            if(value.className.split(' ')[1] === text){
                document.querySelector('.user-list').removeChild(value);
                document.querySelector(textbox).value = '';
            }
        });
    }
}
function removeDayText(text,textbox){
  if(text){
      document.querySelectorAll('.day-list li').forEach((value)=>{
          if(value.className.split(' ')[1] === text){
              document.querySelector('.day-list').removeChild(value);
              document.querySelector(textbox).value = '';
          }
      });
  }
}
function removeTelText(text,textbox){
  if(text){
      document.querySelectorAll('.tel-list li').forEach((value)=>{
          if(value.className.split(' ')[1] === text){
              document.querySelector('.tel-list').removeChild(value);
              document.querySelector(textbox).value = '';
          }
      });
  }
}
function removeKeyText(text,textbox){
  if(text){
      document.querySelectorAll('.key-list li').forEach((value)=>{
          if(value.className.split(' ')[1] === text){
              document.querySelector('.key-list').removeChild(value);
              document.querySelector(textbox).value = '';
          }
      });
  }
}



function deleteAllText(){
    document.querySelectorAll('.user-list li').forEach((value)=>{
            document.querySelector('.user-list').removeChild(value);
        }
    );
    document.querySelectorAll('.day-list li').forEach((value)=>{
      document.querySelector('.day-list').removeChild(value);
        }
    );
    document.querySelectorAll('.tel-list li').forEach((value)=>{
      document.querySelector('.tel-list').removeChild(value);
        }
    );
    document.querySelectorAll('.key-list li').forEach((value)=>{
      document.querySelector('.key-list').removeChild(value);
        }
    );

}

window.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.user-name').forEach((elem) => {
        elem.addEventListener('click', (event) => {
          alert(event.target.innerHTML);
        });
      });
      document.querySelector('.send-button1').addEventListener('click', async (event) => {  
        const text1 = document.querySelector('.input-text1').value;
        const text2 = document.querySelector('.input-text2').value;
        const text3 = document.querySelector('.input-text3').value;
        const text4 = document.querySelector('.input-text4').value;
        await fetch('/api/user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: text1 , birthday: text2 , number: text3, all_key: text4}) });
        if(text1 && text2 && text3 && text4){
        inUserText(text1,text4,'.input-text1')
        inDayText(text2,text4,'.input-text2')
        inTelText(text3,text4,'.input-text3')
        inKeyText(text4,'.input-text4')
        }
      });

      document.querySelector('.delete-button1').addEventListener('click', async (event) => {  
        const text = document.querySelector('.input-text5').value;
        await fetch('/api/delete/user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ all_key: text }) });
        removeUserText(text,'.input-text5');
        removeDayText(text,'.input-text5');
        removeTelText(text,'.input-text5');
        removeKeyText(text,'.input-text5');
      });
      document.querySelector('.deleteAll-button1').addEventListener('click', async (event) => {  
        await fetch('/api/deleteAll/user', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        deleteAllText()
      });
    /*
    document.querySelectorAll('.food-name').forEach((elem) => {
        elem.addEventListener('click', (event) => {
          alert(event.target.innerHTML);
        });
      });
      document.querySelector('.send-button2').addEventListener('click', (event) => {
        const newElement = document.createElement('li');
        const text = document.querySelector('.input-text2').value;
        newElement.innerHTML = text;
        document.querySelector('.food-list').appendChild(newElement);
      });
      */
    });
    
    