
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Emotion, GameProps, QuizQuestion } from '@/lib/types';
import { QUIZ_QUESTIONS, PREDEFINED_EMOTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Zap } from 'lucide-react';

const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length;
  let randomIndex;
  const newArray = [...array];

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
};

const difficulties: QuizQuestion['difficulty'][] = ['Fácil', 'Medio', 'Difícil', 'Experto'];
const QUESTIONS_PER_GAME = 10;

export function GuessEmotionGame({ emotionsList }: GameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [options, setOptions] = useState<Emotion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Emotion | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const allUserEmotions = useMemo(() => {
    const emotionMap = new Map<string, Emotion>();
    PREDEFINED_EMOTIONS.forEach(p => emotionMap.set(p.name.toLowerCase(), { ...p, id: p.name, userProfileId: 'system', isCustom: false } as Emotion));
    emotionsList.forEach(e => emotionMap.set(e.name.toLowerCase(), e));
    return Array.from(emotionMap.values());
  }, [emotionsList]);
  
  const allPredefinedEmotions = useMemo(() => {
      return PREDEFINED_EMOTIONS.map(p => ({ ...p, id: p.name, userProfileId: 'system', isCustom: false } as Emotion));
  }, []);


  const generateQuestion = useCallback(() => {
    const currentDifficulty = difficulties[difficultyIndex];
    
    // Attempt to find a unique question of the current difficulty
    let possibleQuestions = QUIZ_QUESTIONS.filter(q => {
        const difficultyMatch = q.difficulty === currentDifficulty;
        const answerExists = allPredefinedEmotions.some(e => e.name.toLowerCase() === q.correctAnswer.toLowerCase());
        const notInHistory = !questionHistory.includes(q.question);
        return difficultyMatch && answerExists && notInHistory;
    });

    // If no unique questions of current difficulty are found, reset history and try again
    if (possibleQuestions.length === 0) {
        setQuestionHistory([]);
        possibleQuestions = QUIZ_QUESTIONS.filter(q => {
             const difficultyMatch = q.difficulty === currentDifficulty;
             const answerExists = allPredefinedEmotions.some(e => e.name.toLowerCase() === q.correctAnswer.toLowerCase());
             return difficultyMatch && answerExists;
        });
    }
    
    // If still no questions, widen the search to all difficulties (fallback)
    if (possibleQuestions.length === 0) {
        possibleQuestions = QUIZ_QUESTIONS.filter(q => 
            allPredefinedEmotions.some(e => e.name.toLowerCase() === q.correctAnswer.toLowerCase())
        );
    }
    
    if (possibleQuestions.length === 0) {
        // This should now be extremely unlikely
        console.error("No valid quiz questions could be generated even after fallback.");
        setCurrentQuestion(null);
        setIsPlaying(false); // Stop the game if there's a critical error
        return;
    }

    const randomQuestion = shuffleArray(possibleQuestions)[0];
    const correctEmotion = allPredefinedEmotions.find(e => e.name.toLowerCase() === randomQuestion.correctAnswer.toLowerCase());

    if (!correctEmotion) {
        console.error(`Could not find correct emotion "${randomQuestion.correctAnswer}" in predefined list.`);
        // Try to generate a different question to avoid recursion loop
        setQuestionHistory(prev => [...prev, randomQuestion.question]);
        generateQuestion();
        return;
    }

    const incorrectOptions = shuffleArray(allUserEmotions.filter(e => e.name.toLowerCase() !== correctEmotion.name.toLowerCase())).slice(0, 3);
    const allOptions = shuffleArray([correctEmotion, ...incorrectOptions]);

    setCurrentQuestion(randomQuestion);
    setOptions(allOptions);
    setIsAnswered(false);
    setSelectedAnswer(null);

    setQuestionHistory(prev => [...prev, randomQuestion.question]);

  }, [difficultyIndex, allUserEmotions, allPredefinedEmotions, questionHistory]);


  useEffect(() => {
    if (isPlaying && questionsAnswered < QUESTIONS_PER_GAME) {
      generateQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsAnswered, isPlaying]);

  const handleAnswer = (answer: Emotion) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer.name.toLowerCase() === currentQuestion?.correctAnswer.toLowerCase()) {
      setScore(prev => prev + 1);
      setDifficultyIndex(prev => Math.min(prev + 1, difficulties.length - 1));
    } else {
      setDifficultyIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const handleNext = () => {
    setQuestionsAnswered(prev => prev + 1);
  };

  const startGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setDifficultyIndex(0);
    setQuestionHistory([]);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsPlaying(true);
  };
  
  if (allUserEmotions.length < 4) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">¡Faltan Emociones!</p>
              <p className="max-w-md">Necesitas al menos 4 emociones diferentes para jugar a este juego.</p>
              <p className="text-sm mt-2">Ve a "Descubrir" o "Emocionario" para añadir más.</p>
          </div>
      )
  }

  if (!isPlaying) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
            <h2 className="text-2xl font-bold text-primary">Adivina la Emoción</h2>
            <p className="text-muted-foreground my-4 max-w-md">Lee la situación y elige la emoción que mejor la describe. ¡Demuestra tu inteligencia emocional!</p>
            {questionsAnswered >= QUESTIONS_PER_GAME && (
                <>
                    <p className="text-lg my-2">¡Partida terminada!</p>
                    <p className="text-5xl font-bold mb-6">{score} / {QUESTIONS_PER_GAME}</p>
                </>
            )}
            <Button onClick={startGame} size="lg">
                <Zap className="mr-2" />
                {questionsAnswered >= QUESTIONS_PER_GAME ? 'Jugar de Nuevo' : 'Empezar'}
            </Button>
        </div>
    );
  }
  
  if (questionsAnswered >= QUESTIONS_PER_GAME) {
    setIsPlaying(false);
    return null; // Will be re-rendered into the start screen
  }
  
  if (!currentQuestion) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">Cargando...</p>
          </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-center w-full max-w-2xl">
        <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-primary">Puntuación: {score} / {questionsAnswered}</p>
            <p className="text-sm font-semibold text-accent">Dificultad: {currentQuestion.difficulty}</p>
        </div>
        <p className="text-lg mt-4">¿Qué emoción describe mejor esta situación?</p>
      </div>

      <Card className="w-full max-w-2xl p-6 text-center shadow-inner bg-muted/30">
        <CardContent className="p-0">
          <blockquote className="text-lg md:text-xl italic font-semibold">
            "{currentQuestion?.question}"
          </blockquote>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {options.map((option) => {
            const isCorrect = option.name.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
            const isSelected = selectedAnswer?.name === option.name;

            return (
                 <Button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={cn(
                        "h-auto py-3 md:py-4 text-sm md:text-base whitespace-normal",
                        isAnswered && isCorrect && 'bg-green-500 hover:bg-green-600 border-green-500 text-white',
                        isAnswered && isSelected && !isCorrect && 'bg-destructive hover:bg-destructive/90 border-destructive text-destructive-foreground',
                        isAnswered && !isSelected && !isCorrect && 'opacity-50'
                    )}
                 >
                    {isAnswered && isSelected && !isCorrect && <XCircle className="mr-2 h-5 w-5" />}
                    {isAnswered && isCorrect && <CheckCircle className="mr-2 h-5 w-5" />}
                    {option.icon} {option.name}
                 </Button>
            );
        })}
      </div>

      {isAnswered && (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
             <p className={cn(
                "text-lg font-bold text-center",
                selectedAnswer?.name.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? 'text-green-600' : 'text-destructive'
             )}>
                {selectedAnswer?.name.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? '¡Correcto!' : `Incorrecto. La respuesta era: ${currentQuestion.correctAnswer}`}
            </p>
            <Button onClick={handleNext}>
                {questionsAnswered >= QUESTIONS_PER_GAME -1 ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </Button>
        </div>
      )}
    </div>
  );
}
