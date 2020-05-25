<?php

namespace App\Controller\Api;

use App\Entity\Tasks;
use App\Form\TaskType;
use App\Repository\TasksRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;


/**
     * @Route("/api/tasks", name="api_tasks_")
     */
class TasksController extends AbstractController
{   
    /**
    * @Route("/", name="browse", methods={"GET"} )
    */
    public function index(TasksRepository $tasksRepository, SerializerInterface $serializer)
    {
        $tasks = $serializer->normalize($tasksRepository->findAll(), null, ['groups' => 'tasks']);
        return $this->json([
            'tasks' => $tasks,
        ]);
    }

    /**
    * @Route("/{id}", name="edit", requirements={"id":"\d+"}, methods={"PUT"})
    */
    public function edit(int $id, Request $request, TasksRepository $tasksRepository, SerializerInterface $serializer)
    {
        $data = json_decode($request->getContent(), true);
        // on récupere la tasks souhaité
        $task = $tasksRepository->find($id);

        $title = $data["title"];
        $completion = $data["completion"];
        $status = $data["status"];

        // on déclenche une erreur si elle n'existe pas 
        if (!$task) {
            throw $this->createNotFoundException('The task does not exist');
        }

        $form = $this->createForm(TaskType::class, $task);
        $form->submit($data);
    
        if($form->isSubmitted() && $form->isValid()) {

            $task->setTitle($title);
            $task->setCompletion($completion);
            $task->setStatus($status);
            $task->setUpdatedAt(new \DateTime());

            $this->getDoctrine()->getManager()->flush();

        }
        
        $newTask = $serializer->normalize($task, null, ['groups' => 'tasks']);
        

        return $this->json([
         
        ]);
 
    }

    /**
    * @Route("/", name="add", methods={"POST"} )
    */
    public function add(Request $request,  SerializerInterface $serializer)
    {
        $data = json_decode($request->getContent(), true);

        $task = new Tasks();

        $form = $this->createForm(TaskType::class, $task);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {

            $em = $this->getDoctrine()->getManager();

            $em->persist($task);
            $em->flush();

        }

        $newTask = $serializer->normalize($task, null, ['groups' => 'tasks']);

        return $this->json(
            [ 'task' => $newTask,],
            $status = 201,
            $headers = ['content-type' => 'application/Json'],
            $context = []
        );
    }
    
    /**
    * @Route("/{id}", name="delete", requirements={"id":"\d+"}, methods={"DELETE"} )
    */
    public function delete(int $id, Request $request, TasksRepository $tasksRepository)
    {
        $task = $tasksRepository->find($id);

        if (!$task) {
            throw $this->createNotFoundException('The task does not exist');
        }

        $em = $this->getDoctrine()->getManager();

        $em->remove($task);
        $em->flush();

        return $this->json(
            ['message' => 'Task deleted'],
            $status = 200,
            $headers = ['content-type' => 'application/Json'],
            $context = []
        );

    }
}