import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { getUsers } from './api/users';
import { getTodos } from './api/todos';

let sortedField = 'id';

const ACTION_TYPES = {
  ADD_DATA: 'ADD_DATA',
  LOAD_DATA: 'LOAD_DATA',
  DELETE_TODO: 'DELETE_TODO',
  SORT_TODO: 'SORT_TODO',
};

const loadData = data => ({
  type: ACTION_TYPES.LOAD_DATA,
  payload: data,
});

export const addData = data => ({
  type: ACTION_TYPES.ADD_DATA,
  payload: data,
});

export const deleteTodo = todoId => ({
  type: ACTION_TYPES.DELETE_TODO,
  payload: todoId,
});

export const sortData = field => ({
  type: ACTION_TYPES.SORT_TODO,
  payload: field,
});

const initialState = {
  data: [],
  isLoading: false,
  isReady: true,
};

export const getData = () => (dispatch) => {
  store.dispatch(loadData());

  Promise.all([getTodos(), getUsers()])
    .then(([listOfTodos, listOfUsers]) => dispatch(
      addData(listOfTodos.map(todo => (
        {
          ...todo,
          user: listOfUsers.find(user => user.id === todo.userId),
        }
      ))),
      store.dispatch(loadData())
    ));
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_DATA: {
      return {
        ...state,
        data: action.payload,
      };
    }

    case ACTION_TYPES.LOAD_DATA: {
      return {
        ...state,
        isLoading: !state.isLoading,
      };
    }

    case ACTION_TYPES.DELETE_TODO: {
      return {
        ...state,
        data: state.data.filter(item => item.id !== action.payload),
      };
    }

    case ACTION_TYPES.SORT_TODO: {
      switch (action.payload) {
        case 'name': {
          if (sortedField === 'name') {
            return {
              ...state,
              data: [...state.data]
                .reverse(),
            };
          }
          sortedField = 'name';

          return {
            ...state,
            data: [...state.data]
              .sort((a, b) => (a.user[action.payload]
                .localeCompare(b.user[action.payload])
              )),
          };
        }

        case 'id': {
          if (sortedField === 'id') {
            return {
              ...state,
              data: [...state.data]
                .reverse(),
            };
          }
          sortedField = 'id';

          return {
            ...state,
            data: [...state.data]
              .sort((a, b) => (a.id - b.id)),
          };
        }

        case 'completed': {
          if (sortedField === 'completed') {
            return {
              ...state,
              data: [...state.data]
                .reverse(),
            };
          }
          sortedField = 'completed';

          return {
            ...state,
            data: [...state.data]
              .sort((a, b) => (b.completed - a.completed)),
          };
        }

        case 'title': {
          if (sortedField === 'title') {
            return {
              ...state,
              data: [...state.data]
                .reverse(),
            };
          }
          sortedField = 'title';

          return {
            ...state,
            data: [...state.data]
              .sort((a, b) => (a.title.localeCompare(b.title)
              )),
          };
        }
        default: return state;
      }
    }

    default:
      return state;
  }
};

export const store = createStore(
  reducer,
  applyMiddleware(thunk),
);
