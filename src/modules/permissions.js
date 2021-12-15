import permissions from '../mock/permissions';

const myStorage = window.localStorage;

export const filterTypes = {
  all: 'all',
  checked: 'checked',
  unchecked: 'unchecked',
  tags: 'includesTags',
}

export const getPermissions = function(page, filter, search, checked) {
  return mutateData(permissions.items, page, filter, search, checked)
}

// ---------------- Roles ---------------

export const setRoles = function(roles) {
  myStorage.setItem('roles',
    JSON.stringify({
      items: roles || [],
    }));
}


const setRoleAdditionalFields = function(roles) {
  const permissionsList = getPermissions().list;
  return roles.map((item) => {
    const tags = []
    permissionsList.forEach((permission) => {
      if (item.permissions.includes(permission.id)) {
        tags.push(permission.name);
      }
    });
    return {
      ...item,
      buttons: ['edit', 'delete'],
      tags,
    };
  })
}

export const getRoles = function(page, filter, search, checked) {
  const rolesFromStorage = JSON.parse(myStorage.getItem('roles'));
  const dataWithFields = setRoleAdditionalFields(rolesFromStorage?.items || [])
  return mutateData(dataWithFields, page, filter, search, checked)
}

// ------------- Roles Groups -----------

export const setRolesGroups = function(groups) {
  myStorage.setItem('rolesGroups',
    JSON.stringify({
      items: groups || [],
    }));
}

export const getRolesGroups = function() {
  const rolesGroupsFromStorage = JSON.parse(myStorage.getItem('rolesGroups'))?.items || [];
  return rolesGroupsFromStorage.map((item) => ({
    ...item,
    buttons: ['edit', 'delete'],
  })) || [];
}

//------------- Data mutating -----------
const mutateData = function(data, page, filter, search, checked) {
  let list = data
  if (list.length) {
    if (search) {
      list = list.filter(
          (item) => item.name.trim().toLowerCase().includes(search.trim().toLowerCase()),
      );
    }
    if (filter?.type) {
      if (filter.type === 'checked') {
        list = list.filter(
            (item) => checked.includes(item.id),
        );
      }
      if (filter.type === 'unchecked') {
        list = list.filter(
            (item) => !checked.includes(item.id),
        );
      }
      if (filter.type === 'tags') {

      }
    }
    if (page) {
      const size = 10
      const start = (page - 1) * size
      const finish = start + size
      list = list.slice(start, finish)
    }
    return {total: data.length, list: list}
  }
  return {total: 0, list: []}
}

