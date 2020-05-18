<?php

namespace App\Controller\Api;

use App\Repository\TasksRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

    /**
     * @Route("/api/tasks", name="api_tasks_")
     */
class TasksController extends AbstractController
{

    /**
    * @Route("/", name="browse")
    */
    public function loadTaskList(TasksRepository $tasksRepository, SerializerInterface $serializer)
    {
        

        $tasks = $serializer->normalize($tasksRepository->findAll(), null, ['groups' => 'task']);

        return $this->json([
            'tasks' => $tasks,
        ]);
    }
}
