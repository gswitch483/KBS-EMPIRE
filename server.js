const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = 'YOUR_TWILIO_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const twilioPhone = 'YOUR_TWILIO_PHONE';
const client = twilio(accountSid, authToken);

// Temporary in-memory storage for votes (for demo)
const votes = new Set();

app.post('/api/vote', async (req, res) => {
  const { phone, event } = req.body;
  const voteKey = `${phone}-${event}`;

  if (votes.has(voteKey)) {
    return res.json({ message: 'You have already voted for this event.' });
  }

  votes.add(voteKey);

  try {
    await client.messages.create({
      body: `Thanks for voting in the ${event.replace('_', ' ')}!`,
      from: twilioPhone,
      to: phone
    });
    res.json({ message: 'Vote received and SMS sent!' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending SMS.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
