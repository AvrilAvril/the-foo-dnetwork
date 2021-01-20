import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import Dishes from "./views/Dishes";
import Nav from "./views/Nav";

function App() {
  // Define State Variable
  let [users, setUsers] = useState([]);
  let [user, setUser] = useState("");
  let [origins, setOrigins] = useState([]);
  let [origin, setOrigin] = useState("");
  let [dishes, setDishes] = useState([]);
  let [query, setQuery] = useState("");

  //Here GET dishes that match the search (query)
  useEffect(() => {
    const baseURL =
      "https://cdn.contentful.com/spaces/ngczliqhmrc5/environments/master/entries?access_token=47FZlMTfDlGKzrXJnRUXR5t1DP70hkaQVUfjt0BO-lI&content_type=dish&query=";

    axios
      .get(baseURL + query)
      .then((response) => {
        const tentativeDishes = [];
        response.data.items.map((item) => {
          const dish = {
            name: item.fields.dishName,
            description: item.fields.description,
            origin: item.fields.origin, 
            user: {id: item.fields.author.sys.id},
            pictureId: item.fields.picture.sys.id
          }

          response.data.includes.Entry.map((item) => {
            if (item.sys.id === dish.user.id) {
              dish.user.name = item.fields.name;
              dish.user.surname = item.fields.surname;
              dish.user.username = item.fields.username;
            }
            return null;
          })

          

          response.data.includes.Asset.map((asset) => {
            if(asset.sys.id === dish.pictureId) {
              dish.pictureURL = asset.fields.file.url;
            }
          })

          tentativeDishes.push(dish);
          return null
        })
        setDishes(tentativeDishes)
      })
      .catch((err) => console.error(err));
  }, [query]);
  
  // //Here GET dished from a specific user
  useEffect(() => {
    const baseURL =
    "https://cdn.contentful.com//spaces/ngczliqhmrc5/environments/master/entries?access_token=47FZlMTfDlGKzrXJnRUXR5t1DP70hkaQVUfjt0BO-lI&content_type=dish&fields.author.sys.contentType.sys.id=user&fields.author.sys.id=";
    
    axios
    .get(baseURL + user)
    .then((response) => {
      const tentativeDishes = [];
      response.data.items.map((item) => {
        const dish = {
          name: item.fields.dishName,
          description: item.fields.description,
          origin: item.fields.origin, 
          user: {id: item.fields.author.sys.id},
          pictureId: item.fields.picture.sys.id
        }

        
        response.data.includes.Entry.map((item) => {
          if (item.sys.id === dish.user.id) {
              dish.user.name = item.fields.name;
              dish.user.surname = item.fields.surname;
              dish.user.username = item.fields.username;
            }
            return null;
          })

          response.data.includes.Asset.map((asset) => {
            if(asset.sys.id === dish.pictureId) {
              dish.pictureURL = asset.fields.file.url;
            }
          })
        
        tentativeDishes.push(dish);
        return null
      })
      setDishes(tentativeDishes)
    })
    .catch((err) => console.error(err));
  }, [user]);
  
  //Here GET dishes from a specific origin
  
  useEffect(() => {
    const baseURL =
    "https://cdn.contentful.com/spaces/ngczliqhmrc5/environments/master/entries?access_token=47FZlMTfDlGKzrXJnRUXR5t1DP70hkaQVUfjt0BO-lI&content_type=dish&fields.origin[match]=";
    axios
    .get(baseURL + origin)
    .then((response) => {
      const tentativeDishes = [];
      response.data.items.map((item) => {
        const dish = {
          name: item.fields.dishName,
          description: item.fields.description,
          origin: item.fields.origin, 
          user: {id: item.fields.author.sys.id},
          pictureId: item.fields.picture.sys.id
        }
        
        response.data.includes.Entry.map((item) => {
          if (item.sys.id === dish.user.id) {
              dish.user.name = item.fields.name;
              dish.user.surname = item.fields.surname;
              dish.user.username = item.fields.username;
            }
            return null;
          })
          
          response.data.includes.Asset.map((asset) => {
            if(asset.sys.id === dish.pictureId) {
              dish.pictureURL = asset.fields.file.url;
            }
          })

          tentativeDishes.push(dish);
          return null
        })


        setDishes(tentativeDishes)
      })
      .catch((err) => console.error(err));
  }, [origin]);

  //Here GET all the dishes (API call) - (UseEffect)
  useEffect(() => {
    axios
      .get(
        "https://cdn.contentful.com/spaces/ngczliqhmrc5/environments/master/entries?access_token=47FZlMTfDlGKzrXJnRUXR5t1DP70hkaQVUfjt0BO-lI&content_type=dish&order=fields.dishName"
      )
      .then((response) => {
        const tentativeDishes = [];
        response.data.items.map((item) => {
          const dish = {
            name: item.fields.dishName,
            description: item.fields.description,
            origin: item.fields.origin, 
            user: {id: item.fields.author.sys.id},
            pictureId: item.fields.picture.sys.id
          }
          
          setUsers(response.data.includes.Entry);
          response.data.includes.Entry.map((item) => {
            if (item.sys.id === dish.user.id) {
              dish.user.name = item.fields.name;
              dish.user.surname = item.fields.surname;
              dish.user.username = item.fields.username;
            }
            return null;
          })

          response.data.includes.Asset.map((asset) => {
            if(asset.sys.id === dish.pictureId) {
              dish.pictureURL = asset.fields.file.url;
            }
          })

          tentativeDishes.push(dish);
          return null
        })
        setDishes(tentativeDishes)
      })
      .catch((err) => console.error(err));
  }, []);

   if(dishes) {
     dishes.map((dish) => {
       if (!origins.includes(dish.origin)) setOrigins([...origins, dish.origin]);
       return null;
     })
   }

  return (
    <div className="wrapper">
      <Nav 
        changeQuery={(query) => setQuery(query)} 
        changeOrigin={(origin) => {setOrigin(origin)}} 
        changeUser={(user) => setUser(user)}
        origins={origins} 
        users={users} 
      />
      {dishes ? <Dishes dishesCollection={dishes} images={images}/> : null}
    </div>
  );
}

export default App;
