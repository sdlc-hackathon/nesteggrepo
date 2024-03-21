
import React, { useState, useEffect } from 'react';
export default App;

function App() {
  return (
    <div className="bg-[url('IBM-Watsonx-Logo-bg.png')] bg-hero bg-no-repeat bg-cover bg-center bg-fixed">
      <Header />
      <FlashCards />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <div>
      <div class="grid grid-cols-3 gap-6 p-6 max-w-m mx-auto">
        <div class="max-w-m mx-auto"><img src="lloydsbank_logo_icon.png" alt="Lloyds Banking Group Logo" /></div>
        <div class="mx-auto font-semibold text-4xl text-blue-900 p-8">WatsonX<p align="center">FAQs</p></div>
        <div class="max-w-m mx-auto"><img src="IBM_logo_pos_RGB.png" alt="IBM Engineering Logo" /></div>
        </div>
      </div>
  );
}

function Footer() {
  return (
    <div>
    <div className="container mx-auto p-5"></div>
    <div class="grid grid-cols-3 gap-6 p-4 max-w-m mx-auto">
      <div></div>
      <div><img src="watsonx_logotype_pos_blue60_CMYK.png" alt="WatsonX"/></div>
      <div></div>
    </div>
    </div>
  );
}

function FlashCards() {
  const [selectedId, setSelectedId] = useState(null);

  function handleClick(id) {
    setSelectedId(id !== selectedId ? id : null);
  }

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const handleQuestionChange = (event) => {
      setNewQuestion(event.target.value);
  };

  const handleAnswerChange = (event) => {
      setNewAnswer(event.target.value);
    };

  const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!newQuestion || !newAnswer) {
        alert(`Please enter both a FAQ and it's answer`);
        return;
      }
  
      const newData = {
          question: newQuestion,
          answer: newAnswer,
      };
  
      try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}`, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        });
  
        if (!response.ok) {
          throw new Error(`Error sending data: ${response.statusText}`);
        }
  
        // Update local state with the new data 
        setData([...data, newData]);
  
        // Clear input fields
        setNewQuestion('');
        setNewAnswer('');
    
      } catch (error) {
        setError(error.message);
      } finally {
        // reset loading state
        setIsLoading(false);
      }
    };
  
  const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const json = await response.json();
        setData(json.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
  useEffect(() => {
      fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="container mx-auto">
      {data.map((item) => (
        <div
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={item.id === selectedId ? "p-10 max-w-m mx-auto bg-green-900/80 rounded-xl flex items-center space-x-4 space-y-4 font-semibold" : "p-10 max-w-m mx-auto bg-green-100/50 hover:bg-green-900/50 rounded-xl shadow-lg flex items-center space-x-4 space-y-4"}
        >
          <p>
            {item.id === selectedId ? item.answer : item.question}
          </p>
        </div>
        
      ))}
    </div>
    <div className="container mx-auto p-5"></div>
    <div className="container mx-auto bg-gray-500/50 rounded-xl p-6 h-30">
    <div className="font-semibold text-green-900">Add New FAQ</div>
    <form onSubmit={handleSubmit} className="mx-center">
      <label htmlFor="question">Question:</label>&nbsp;
      <input
          type="text"
          id="question"
          value={newQuestion}
          onChange={handleQuestionChange}
          />&nbsp;
          <label htmlFor="answer">Answer:</label>&nbsp;
          <input
            type="text"
            id="answer"
            value={newAnswer}
            onChange={handleAnswerChange}
          />&nbsp;
          <button className="bg-gray-600 rounded-md p-2 text-blue-500" type="submit">Submit</button>
      </form>
      </div>
    </div>
  );
}
