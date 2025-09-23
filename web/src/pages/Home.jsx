import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note"
import "../styles/Home.css"
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Stats } from "../components/Stats/Stats";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        // api
        //     .get("/api/notes/")
        //     .then((res) => res.data)
        //     .then((data) => {
        //         setNotes(data);
        //         console.log(data);
        //     })
        //     .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Note created!");
                else alert("Failed to make note.");
                getNotes();
            })
            .catch((err) => alert(err));
    };

    return (
      <div>
        <Sidebar />
        <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
          <div className="flex max-w-2xl grow flex-col">
            {units.map((unit) => (
              <UnitSection unit={unit} key={unit.unitNumber} />
            ))}
            <div className="sticky bottom-28 left-0 right-0 flex items-end justify-between">
              <Link
                href="/lesson?practice"
                className="absolute left-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 md:left-0"
              >
                <span className="sr-only">Practice exercise</span>
                <PracticeExerciseSvg className="h-8 w-8" />
              </Link>
              {scrollY > 100 && (
                <button
                  className="absolute right-4 flex h-14 w-14 items-center justify-center self-end rounded-2xl border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 md:right-0"
                  onClick={() => scrollTo(0, 0)}
                >
                  <span className="sr-only">Jump to top</span>
                  <UpArrowSvg />
                </button>
              )}
            </div>
          </div>
        </div>
        <Stats />
      </div>
    );
}

export default Home;
