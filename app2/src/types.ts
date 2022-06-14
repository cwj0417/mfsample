export type requestResponse<T> = {
    code: string,
    message: string,
    result: T,
}

export type pageResponse<T> = {
    currentPage: number,
    pageSize: number,
    total: number,
    list: T[]
}

export type status = 0 | 1

export type componentConfigType = {
    componentVersion: number,
        imageUrl: string,
        docUrl: string,
}

export type listitem = {
    companyTaxNo: string,
    companyName: string,
    status: status,
    lastLoginTime: string,
    componentList: componentConfigType[]
}
