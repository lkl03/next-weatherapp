import React, { useState } from 'react'
import cities from '../lib/city.list.json'

const SearchBox = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])

    const onChange = (e) => {
        const {value} = e.target
        setQuery(value)

        let matchingCities = []

        if(value.length > 3) {
            for(let city of cities ) {
                if(matchingCities.length >= 5) {
                    break;
                }
                const match = city.name.toLowerCase().startsWith(value.toLowerCase())
                if (match) {
                    matchingCities.push(city)
                }
            }
        }

        return setResults(matchingCities)
    }

    return (
    <div className="search">
        <input type="text" value={query} onChange={onChange}/>
    </div>
  )
}

export default SearchBox