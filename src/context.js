import axios from 'axios'
import React, { useState, useContext } from 'react'

const categories = {
	books: 10,
	film: 11,
	music: 12,
	television: 14,
	videoGames: 15,
	boardGames: 16,
	nature: 17,
	computers: 18,
	mathematics: 19,
	mythology: 20,
	sports: 21,
	geography: 22,
	history: 23,
	politics: 24,
	art: 25,
	celebrities: 26,
	animals: 27,
	vehicles: 28,
	comics: 29,
	gadgets: 30,
	anime: 31,
	cartoon: 32,
}

// const difficulties = {
// 	easy: 'easy',
// 	medium: 'medium',
// 	hard: 'hard',
// }

const API_ENDPOINT = 'https://opentdb.com/api.php?'

// const url = ''
// const tempUrl =
// 	'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
	const [waiting, setWaiting] = useState(true)
	const [loading, setLoading] = useState(false)
	const [questions, setQuestions] = useState([])
	const [index, setIndex] = useState(0)
	const [correct, setCorrect] = useState(0)
	const [error, setError] = useState(false)
	const [quiz, setQuiz] = useState({
		amount: 10,
		category: 'sport',
		difficulty: 'easy',
	})
	const [isModalOpen, setIsModalOpen] = useState(false)

	const fetchQuestions = async (url) => {
		setLoading(true)
		setWaiting(false)
		const resp = await axios(url).catch((err) => console.log(err))
		if (resp) {
			const data = resp.data.results
			if (data.length > 0) {
				setQuestions(data)
				setLoading(false)
				setWaiting(false)
				setError(false)
			} else {
				setWaiting(true)
				setError(true)
			}
		} else {
			setWaiting(true)
		}
	}

	const nextQuestion = () => {
		setIndex((oldIndex) => {
			const index = oldIndex + 1
			if (index > questions.length - 1) {
				openModal()
				return 0
			} else {
				return index
			}
		})
	}

	const checkAnswer = (value) => {
		if (value) {
			setCorrect((oldState) => oldState + 1)
		}
		nextQuestion()
	}

	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setWaiting(true)
		setCorrect(0)
		setIsModalOpen(false)
	}

	const handleChange = (e) => {
		const name = e.target.name
		const value = e.target.value
		setQuiz({ ...quiz, [name]: value })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const { amount, category, difficulty } = quiz
		const url = `${API_ENDPOINT}amount=${amount}&category=${categories[category]}&difficulty=${difficulty}&type=multiple`
		fetchQuestions(url)
	}

	return (
		<AppContext.Provider
			value={{
				waiting,
				loading,
				questions,
				index,
				correct,
				error,
				isModalOpen,
				nextQuestion,
				checkAnswer,
				closeModal,
				quiz,
				handleChange,
				handleSubmit,
			}}
		>
			{children}
		</AppContext.Provider>
	)
}
// make sure use
export const useGlobalContext = () => {
	return useContext(AppContext)
}

export { AppContext, AppProvider }
