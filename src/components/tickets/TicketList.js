import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Tickets.css"

export const TicketList = ({searchTermState }) => {
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFiltered] = useState([])
    const [emergency, setEmergency] = useState(false)
    const [openOnly, setOpenOnly] = useState(false)

    const navigate = useNavigate()

    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)

    useEffect(
        () => {
            const searchedTickets = tickets.filter(ticket => ticket.description.toLowerCase().startsWith(searchTermState.toLowerCase()))
            setTickets(searchedTickets)
        }, [ searchTermState ]
    )

    useEffect(
        () => {
            if(emergency){
                const emergencyTickets = tickets.filter( ticket => ticket.emergency === true)
                setFiltered(emergencyTickets)
            }
            else{
                setFiltered(tickets)
            }
        }, [emergency]
    )

    useEffect(
        () => {
            fetch('http://localhost:8088/serviceTickets')        //get the tickets
                .then(response => response.json())               //convert the gotten code to js
                .then ((ticketArray) => { setTickets(ticketArray) })
        },
        [] // When this array is empty, you are observing initial component state
    )

    useEffect (
        () => {
            if(honeyUserObject.staff){ // for employees
                setFiltered(tickets)
            }
            else{                      // for customers
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFiltered(myTickets)
            }
        },
        [tickets]
    )

    useEffect(
        () => {
            if (openOnly) {
                const openTicketArray = tickets.filter(ticket => {
                    return ticket.userId === honeyUserObject.id && ticket.dateCompleted === ""
                })
                setFiltered(openTicketArray)
            }
            else{
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFiltered(myTickets)
            }
        },
        [openOnly]
    )

    return <>

        { honeyUserObject.staff?
            <>
            <button onClick={()=> setEmergency(true)}>emergency Only</button>
            <button onClick={()=> setEmergency(false)}>show all</button>
            </>
            :<>
            <button onClick={() => navigate("/ticket/create")}>Create Ticket</button>
            <button onClick={() => setOpenOnly (true)}>Open Ticket</button>
            <button onClick={() => setOpenOnly (false)}>All Tickets</button>
            </>
        }

        <h2>List of Tickets</h2>
        <article className="tickets">
            {
                filteredTickets.map(
                    (ticket) => {
                        return <section className="ticket" key={`ticket--${ticket.id}`}>
                            <header>{ticket.description}</header>
                            <footer>Emergency: {ticket.emergency ? "boom" : "No"}</footer>
                        </section>
                    }
                )
            }
        </article>
    </>
    
}

