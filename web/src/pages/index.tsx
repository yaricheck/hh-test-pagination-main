import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container, Pagination } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
  page: number
  pagesCount: number
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const page = Array.isArray(ctx.query.page) ? ctx.query.page[0] : ctx.query.page;
    const url = new URL('http://localhost:3000/users');
    if (page) url.searchParams.append('page', page);
    const res = await fetch(url.href, {method: 'GET'});
    if (!res.ok) {
      return {props: {statusCode: res.status, users: [], page: 0, pagesCount: 0}}
    }
    const { users, pagesCount } = await res.json();
    return {
      props: { statusCode: 200, users, pagesCount, page: parseInt(page || '1') }
    }
  } catch (e) {
    return {props: {statusCode: 500, users: [], page: 0, pagesCount: 0}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({ statusCode, users, page, pagesCount }: TGetServerSideProps) {
  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>
          <Pagination>
            <Pagination.First href={`/?page=1`} />
            <Pagination.Prev href={page === 1 ? `/?page=1` : `/?page=${page - 1}`} />
            {
              Array.from({ length: 10 }).map((_, index) => {
                const key = page < 6 ? index + 1
                  : (page > pagesCount - 6 ? index + pagesCount - 9 : index + page - 5);
                return (
                  <Pagination.Item key={key} href={`/?page=${key}`} active={key===page}>
                    {key}
                  </Pagination.Item>
                );
              })
            }
            <Pagination.Next href={page === pagesCount ? `/?page=${pagesCount}` : `/?page=${page + 1}`} />
            <Pagination.Last href={`/?page=${pagesCount}`} />
          </Pagination>
        </Container>
      </main>
    </>
  );
}
