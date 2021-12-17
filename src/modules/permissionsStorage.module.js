import permissions from '../mock/permissions';

//--------------- Constants ----------------

const myStorage = window.localStorage;

export const filterTypes = {
  all: 'all',
  checked: 'checked',
  unchecked: 'unchecked',
}

const customFilterTypes = {
  tags: 'tags',
}

export const getPermissions = function(options) {
  return mutateData({...options, data: permissions.items })
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
      if (item.permissions.map(item => item.id).includes(permission.id)) {
        tags.push(permission);
      }
    });
    return {
      ...item,
      buttons: ['edit', 'delete'],
      tags,
    };
  })
}

export const getRoles = function(options) {
  const rolesFromStorage = JSON.parse(myStorage.getItem('roles'));
  const dataWithFields = setRoleAdditionalFields(rolesFromStorage?.items || [])
  return mutateData({...options, data: dataWithFields })
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
const paginateList = function (list, page) {
  const size = 10
  const start = (page - 1) * size
  const finish = start + size
  return list.slice(start, finish)
}

const mutateData = function(options) {
  let list = options.data
  let total = options.data.length
  if (list.length) {
    list = list.filter(listItem => {
      let included = true
      if (options.search) {
        included = listItem.name.trim().toLowerCase().includes(options.search.trim().toLowerCase())
        if (!included) {
          return included;
        }
      }
      if (options.mainFilter && options.mainFilter !== filterTypes.all) {
        included = options.mainFilter === filterTypes.checked
            ? options.checked.includes(listItem.id)
            : !options.checked.includes(listItem.id)
        if (!included) {
          return included;
        }
      }
      if (options.customFilters) {
        if (options.customFilters[customFilterTypes.tags]) {
          const listItemPermissionsIds = listItem.permissions.map(permission =>  permission.id)
          included = options.customFilters[customFilterTypes.tags].every(tagId => listItemPermissionsIds.includes(tagId))
        }
        if (!included) {
          return included;
        }
      }
      return included
    })
    total = list.length
    if (options.page) {
      list = paginateList(list, options.page)
    }
    return {total: total, list: list}
  }
  return {total: 0, list: []}
}

