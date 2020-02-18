// Storage Controller ==========================
const StorageCTRL = (function(){
  
  // public methods
  return {
    storeItem: function(item){
      let items;
      if (localStorage.getItem('items')===null){
        items = [];
        // push new item
        items.push(item);
        // set LS
        localStorage.setItem('items',JSON.stringify(items));
      }else {
        items = JSON.parse(localStorage.getItem('items'))
        // push the new item
        items.push(item);
        // set LS
        localStorage.setItem('items',JSON.stringify(items));
      }
    },
    getFromStorage: function(){
      let items;
      if(localStorage.getItem('items')===null){
        items = [];
      }
      else {
        items = JSON.parse(localStorage.getItem('items'))
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item,index)=>{
        if(updatedItem.id === item.id){
          items.splice(index,1,updatedItem);
        }
      })
      localStorage.setItem('items',JSON.stringify(items));
    },
    deleteFromStorage: function(deleteItem){
      let items = JSON.parse(localStorage.getItem('items'))

      items.forEach((item,index)=>{
        if (item.id === deleteItem.id){
          items.splice(index,1);
        }
      })
      localStorage.setItem('items',JSON.stringify(items));
    },
    clearAllFromStorage: function(){
      let items = [];
      localStorage.setItem('items',JSON.stringify(items));
    }
  }
})()



// Item Controller ==========================
const ItemCtrl = (function(){
  
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  
  // Data Structure / State
  const data = {
    items: StorageCTRL.getFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // public methods
  return {
    getItems: function(){
      return data.items;
    },
    logData: function(){
      return data;
    },
    addItem: function(name, calories){
      // generate an ID for new items
      let ID;
      if (data.items.length > 0){
        ID = data.items.length
      } 
      else {
        ID = 0
      }
      // calories to number
      calories = parseInt(calories)

      // create new item
      newItem = new Item(ID, name, calories)

      // add to items array
      data.items.push(newItem)

      return newItem
    },
    getTotalCalories: function(){
      let total = 0;
      data.items.forEach(function(item){
        total += item.calories;
      });
      data.totalCalories = total;

      return data.totalCalories;
    },
    getItemById: function(id){
      let found;
      data.items.forEach(function(item){
        if (item.id === id){
          found = item;
        }
      })
      return found
    },
    updateItem: function(name, calories){
      // calories to #
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      })
      return found;
    },
    deleteItem: function(id){
      // get id's
      ids = data.items.map(item => {
        return item.id;
      })
      // get index
      const index = ids.indexOf(id);
      // remove item
      data.items.splice(index,1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    }
  }
})();



// UI Controller ==========================
const UICtrl = (function(){
  // UI selectors - in case references to html ID/classes are changed
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    caloriesTotal: '.total-calories',
    clearBtn: '.clear-btn'
  }

  // Public Methods
  return {
    populateItemsList: function(items){
      let html = '';

      items.forEach(item => {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    addListItem: function(item){
      // show the list
      document.querySelector(UISelectors.itemList).style.display = 'block'
      // create li element
      const li = document.createElement('li');
      // add class
      li.className = 'collection-item';
      // id
      li.id = `item-${item.id}`;
      // add html
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `
      // insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li)
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    updateTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.caloriesTotal).textContent = totalCalories
    },
    // Need these UI selectors in the event listeners, so we must make them public. 
    getSelectors: function(){
      return UISelectors;
    },
    getItemInputs: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    setInitialState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },
    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    updateListItem: function(updatedItem){
      let listItems = document.querySelectorAll(UISelectors.listItems)

      // convert node list to array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${updatedItem.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${updatedItem.name}: </strong> <em>${updatedItem.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        `
        }
      })
    },
    deleteListItem: function(id){
      // grab the relevant document element using item notation
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);

      // remove the item
      item.remove();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // turn into an array
      listItemsArray = Array.from(listItems);

      listItemsArray.forEach(item=>{
        item.remove();
      })
    }
  }
})();



// App Controller ==========================
const App = (function(ItemCtrl, StorageCTRL, UICtrl){
  // Load event listeners
  const loadEventListeners = function(){
    const UISelectors = UICtrl.getSelectors()

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // disable submit on enter (not working)
    document.querySelector(UISelectors.addBtn).addEventListener('keypress',function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    })

    // Edit icon event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click',undoEdit);
  
    // Delete button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

    // Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);
  }


  // Add Item & Submit
  const itemAddSubmit = function(e){
    e.preventDefault()
    // get new item inputs from UI controller
    const input = UICtrl.getItemInputs()
    
    // check that name and calories are both input
    if (input.name !== '' && input.calories !== ''){
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // add item to UI list
      UICtrl.addListItem(newItem);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // show total calories in the UI
      UICtrl.updateTotalCalories(totalCalories);

      // persist to local storage
      StorageCTRL.storeItem(newItem)

      // clear fields
      UICtrl.clearInput();
    } 
  }
  // Edit item click event (edit state activation)
  const itemEditClick = function(e){
    e.preventDefault()

    if (e.target.classList.contains('edit-item')){
      // get list item ID
      const listID = e.target.parentNode.parentNode.id;
      // split 'item-0' at hyphen
      const listIDArray = listID.split('-');
      const id = parseInt(listIDArray[1]);

      // get the item from the ID
      const itemToEdit = ItemCtrl.getItemById(id);

      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // add item to form
      UICtrl.addItemToForm();
    }
  }

  const itemUpdateSubmit = function(e){
    e.preventDefault();
    // get item input
    const input = UICtrl.getItemInputs();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update UI
    UICtrl.updateListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // show total calories in the UI
    UICtrl.updateTotalCalories(totalCalories);

    // update LS
    StorageCTRL.updateItemStorage(updatedItem);

    // revert back to initial state
    UICtrl.setInitialState();
  }

  const itemDeleteSubmit = function(e){
    e.preventDefault();

    // get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // delete from data'
    ItemCtrl.deleteItem(currentItem.id);

    // delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // show total calories in the UI
    UICtrl.updateTotalCalories(totalCalories);

    // delete from LS
    StorageCTRL.deleteFromStorage(currentItem);

    // revert back to initial state
    UICtrl.setInitialState();
  }

  const clearAllItemsClick = function(e){
    e.preventDefault();
    // delete all items from data structure
    ItemCtrl.clearAllItems();
    // remove from the UI
    UICtrl.removeItems();
    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // show total calories in the UI
    UICtrl.updateTotalCalories(totalCalories);
    // clear from LS
    StorageCTRL.clearAllFromStorage();
    // hide UL
    UICtrl.hideList();
  }

  const undoEdit = function(e){
    e.preventDefault();
    UICtrl.setInitialState();
  }

  // public methods
  return {
    init: function(){
      console.log('Initializing...');

      // set initial state
      UICtrl.setInitialState()
      
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // check if any items - if not, hide UL
      if (items.length === 0){
        UICtrl.hideList()
      } else {
        // populate list with items
        UICtrl.populateItemsList(items);
      }
      
      // update total calories display
      UICtrl.updateTotalCalories(ItemCtrl.getTotalCalories());

      // Load event listeners
      loadEventListeners()
    }
  }
})(ItemCtrl, StorageCTRL, UICtrl);



// Initialize App ==========================
App.init();