import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
} from "@mui/material";
import styles from "./index.module.css";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import appFirebase from "../firebase";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [limitInput, setLimitInput] = useState();
  const [result, setResult] = useState();
  const [companyNameInput, setCompanyNameInput] = useState("Ideas2IT");
  const [companyVisionInput, setCompanyVisionInput] = useState(
    "Innovative Product Engineering"
  );
  const [targetAudience, setTargetAudience] = useState(
    "TEch Enthusiast and Health care vetarans in North America"
  );
  const [promptData, setPromptData] = useState("");

  const [toneInput, setToneInput] = useState("");
  const [postType, setPostType] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [backButton, setBackButton] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToneChange = (event) => {
    setToneInput(event.target.value);
  };

  const handlePostTypeChange = (e) => {
    setPostType(e.target.value);
  };

  const handleGoBack = (e) => {
    setShowForm(true);
    setBackButton(false);
  };

  const handleClick = (e) => {
    console.info("You clicked the Chip.");
  };

  useEffect(() => {
    if (window.localStorage.getItem("promptData") === null) {
      window.localStorage.setItem(
        "promptData",
        JSON.stringify({ count: 0, id: uuidv4() })
      );
      setPromptData({ count: 0, id: uuidv4() });
    } else {
      setPromptData(JSON.parse(window.localStorage.getItem("promptData")));
    }
  }, []);

  function generatePrompt(animal) {
    console.log("Writing a post");
    console.log(
      "Translate the following raw concept into an eloquent, compelling, and persuasive piece of " +
        postType +
        " marketing content that instantly engages the reader and accentuates the key points. Adhere strictly to the company's brand guidelines in terms of tone, voice, visuals, and values, ensuring they are seamlessly integrated throughout the content. Apply established marketing principles to stimulate reader interaction and inspire desired actions. The raw concept to be transformed, following the specific brand guidelines of " +
        companyNameInput +
        " is: " +
        animalInput +
        "maintain the " +
        toneInput +
        " tone. The company does " +
        companyVisionInput +
        " and the target audiences are " +
        targetAudience
    );
    return (
      "Translate the following raw concept into an eloquent, compelling, and persuasive piece of " +
      postType +
      " marketing content that instantly engages the reader and accentuates the key points. Adhere strictly to the company's brand guidelines in terms of tone, voice, visuals, and values, ensuring they are seamlessly integrated throughout the content. Apply established marketing principles to stimulate reader interaction and inspire desired actions. The raw concept to be transformed, following the specific brand guidelines of " +
      companyNameInput +
      " is: " +
      animalInput +
      ". maintain the " +
      toneInput +
      " tone. The company does " +
      companyVisionInput +
      " and the target audiences for this content are " +
      targetAudience
    );
  }
  async function onSubmit(event) {
    event.preventDefault();
    if (promptData.count != 3) {
      setResult("");
      setShowForm(false);
      setBackButton(true);
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ animal: generatePrompt(animalInput) }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }

        setResult(data.result);
        const firestore = getFirestore(appFirebase);
        addDoc(collection(firestore, promptData?.id), {
          count: ++promptData.count,
          prompt: animalInput,
          result: data.result,
        });
        window.localStorage.setItem(
          "promptData",
          JSON.stringify({
            count: promptData.count,
            id: promptData.id,
          })
        );
        setAnimalInput("");
        setToneInput("");
        setLimitInput(100);
      } catch (error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    } else if (promptData.count === 3) {
      handleClickOpen();
    }
  }

  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Write your marketing content</h3>
        {showForm && (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="companyName"
              placeholder="Enter your company name"
              value={companyNameInput}
              onChange={(e) => setCompanyNameInput(e.target.value)}
            />

            <textarea
              type="text"
              name="USP"
              placeholder="Tell us what you do and why you exist"
              value={companyVisionInput}
              onChange={(e) => setCompanyVisionInput(e.target.value)}
            />

            <textarea
              type="text"
              name="targetAudience"
              placeholder="Tell us about your target audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />

            <textarea
              name="prompt"
              placeholder="Enter your content"
              value={animalInput}
              onChange={(e) => setAnimalInput(e.target.value)}
            />
            <input
              type="number"
              name="limit"
              placeholder="Enter number of words"
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
            />

            <select onChange={handleToneChange}>
              <option value="Formal">Formal</option>
              <option value="Informal">Informal</option>
              <option value="Excited">Excited</option>
              <option value="Optimistic">Optimistic</option>
              <option value="Friendly">Friendly</option>
              <option value="Curious">Curious</option>
              <option value="Assertive">Assertive</option>
              <option value="Encouraging">Encouraging</option>
              <option value="Surprised">Surprised</option>
              <option value="Cooperative">Cooperative</option>
              <option value="Surprised">Persuasive</option>
              <option value="Conversational">Conversational</option>
              <option value="Persuasive">Persuasive</option>
            </select>

            <select>
              <option value="LinkedIn">AIDA</option>
              <option value="Twitter">Twitter</option>
            </select>

            <select onChange={handlePostTypeChange}>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
            </select>
            <input type="submit" value="Generate Content" />
          </form>
        )}
        <div style={{ maxWidth: "50%", whiteSpace: "pre-line" }}>{result}</div>
        {backButton && (
          <input type="submit" value="Go Back" onClick={handleGoBack} />
        )}
      </main>
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Free Limits reached, to subscribe to this website, please enter your
            email address here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
