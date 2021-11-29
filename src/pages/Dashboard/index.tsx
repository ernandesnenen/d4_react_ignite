import { Component, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { IFood } from '../../../types';



function Dashboard(){
  const [foods, setFoods]= useState<IFood[]>([])
  const [editingFood, setEditingFood]= useState<IFood>()
  const [modalOpen, setModalOpen]= useState(false)
  const [editModalOpen, setEditModalOpen]= useState(false)
 
  useEffect( () => {
    async function getFoods (){
      const response = await api.get('/foods');
     

      setFoods(response.data);
    }
    getFoods()
  },[])

 async function handleAddFood(food:IFood ){
   
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
    
     
        setFoods([...foods, response.data]);

    

    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood( food:IFood){
    // const { foods, editingFood } = this.state;
    if (!editingFood) {
      return;
    }
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

 async function handleDeleteFood(id:number) {
    // const { foods } = this.state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal () {
        // const { modalOpen } = this.state;
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(){
    // const { editModalOpen } = this.state;
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food:IFood){
    // this.setState({ editingFood: food, editModalOpen: true });
    setEditingFood(food)
    setEditModalOpen(true)
    }

 
    // const { modalOpen, editModalOpen, editingFood, foods } = this.state;

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={String(food.id)}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }


export default Dashboard;
